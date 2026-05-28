import Papa from 'papaparse'
import { Person } from '../types'
import { generateId } from './formatters'

type RawRow = Record<string, string>

function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s._\-]/g, '')
}

const FIELD_ALIASES: Record<string, string[]> = {
  name: ['nombre', 'name', 'empleado', 'persona', 'trabajador'],
  cedula: ['cedula', 'documento', 'cc', 'identificacion', 'numerodedocumento'],
  startDate: ['inicio', 'startdate', 'fechainicio', 'finicio', 'fechadeinicio', 'fechaingreso'],
  endDate: ['fin', 'final', 'enddate', 'fechafinal', 'ffinal', 'fechadefin', 'fechafin'],
  totalPackages: ['paquetes', 'packages', 'totalpackages', 'totalpaquetes', 'cantidad'],
  value: ['valor', 'value', 'pago', 'total', 'monto', 'salario', 'sueldo'],
}

const FIELD_LABELS: Record<string, string> = {
  name: 'nombre',
  cedula: 'cedula',
  startDate: 'fecha inicio',
  endDate: 'fecha final',
  totalPackages: 'paquetes',
  value: 'valor',
}

function detectColumns(headers: string[]): Partial<Record<string, string>> {
  const result: Partial<Record<string, string>> = {}
  for (const header of headers) {
    const norm = normalizeKey(header)
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (aliases.includes(norm) && !(field in result)) {
        result[field] = header
      }
    }
  }
  return result
}

function parseDate(val: string): string | null {
  const s = (val || '').trim()
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const m = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/)
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
  return null
}

function parseNum(val: string): number {
  return Number((val || '').replace(/[^0-9.]/g, '')) || 0
}

export interface ImportResult {
  people: Person[]
  errors: string[]
}

function rowsToPeople(rows: RawRow[]): ImportResult {
  if (!rows.length) return { people: [], errors: ['El archivo está vacío'] }

  const headers = Object.keys(rows[0])
  const colMap = detectColumns(headers)

  const required = ['name', 'cedula', 'startDate', 'endDate', 'totalPackages', 'value']
  const missing = required.filter(f => !(f in colMap))
  if (missing.length > 0) {
    return {
      people: [],
      errors: [`Columnas no reconocidas: ${missing.map(f => FIELD_LABELS[f]).join(', ')}`],
    }
  }

  const people: Person[] = []
  const errors: string[] = []

  rows.forEach((row, i) => {
    const rowNum = i + 2
    const name = (row[colMap.name!] || '').trim()
    const cedula = (row[colMap.cedula!] || '').trim()
    const startDate = parseDate(row[colMap.startDate!] || '')
    const endDate = parseDate(row[colMap.endDate!] || '')
    const totalPackages = parseNum(row[colMap.totalPackages!] || '')
    const value = parseNum(row[colMap.value!] || '')

    const errs: string[] = []
    if (!name) errs.push('nombre vacío')
    if (!cedula) errs.push('cédula vacía')
    if (!startDate) errs.push(`fecha inicio inválida`)
    if (!endDate) errs.push(`fecha final inválida`)
    if (totalPackages <= 0) errs.push('paquetes ≤ 0')
    if (value <= 0) errs.push('valor ≤ 0')

    if (errs.length) {
      errors.push(`Fila ${rowNum}: ${errs.join(', ')}`)
      return
    }

    people.push({
      id: generateId(),
      name,
      cedula,
      startDate: startDate!,
      endDate: endDate!,
      totalPackages,
      value,
    })
  })

  return { people, errors }
}

async function importFromCSV(file: File): Promise<ImportResult> {
  return new Promise(resolve => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: r => resolve(rowsToPeople(r.data)),
      error: e => resolve({ people: [], errors: [e.message] }),
    })
  })
}

async function importFromExcel(file: File): Promise<ImportResult> {
  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  const rows: RawRow[] = rawRows.map(row => {
    const result: RawRow = {}
    for (const [key, val] of Object.entries(row)) {
      if (val instanceof Date) {
        result[key] = val.toISOString().slice(0, 10)
      } else {
        result[key] = String(val ?? '')
      }
    }
    return result
  })

  return rowsToPeople(rows)
}

export async function importFromFile(file: File): Promise<ImportResult> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'csv') return importFromCSV(file)
  if (ext === 'xlsx' || ext === 'xls') return importFromExcel(file)
  return { people: [], errors: ['Formato no soportado. Usa .csv, .xlsx o .xls'] }
}
