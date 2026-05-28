import { Person } from '../types'
import { formatDate } from './formatters'

const HEADERS = ['Nombre', 'Cedula', 'Fecha Inicio', 'Fecha Final', 'Paquetes', 'Valor']

function toRows(people: Person[]) {
  return people.map(p => ({
    Nombre: p.name,
    Cedula: p.cedula,
    'Fecha Inicio': formatDate(p.startDate),
    'Fecha Final': formatDate(p.endDate),
    Paquetes: p.totalPackages,
    Valor: p.value,
  }))
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToCSV(people: Person[]): void {
  const rows = people.map(p => [
    p.name,
    p.cedula,
    formatDate(p.startDate),
    formatDate(p.endDate),
    p.totalPackages.toString(),
    p.value.toString(),
  ])

  const csv = [HEADERS, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')

  // BOM so Excel opens UTF-8 CSV without encoding issues
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, 'nomina.csv')
}

export async function exportToExcel(people: Person[]): Promise<void> {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(toRows(people))

  // Auto-width columns
  const colWidths = HEADERS.map((h, i) => {
    const maxLen = Math.max(
      h.length,
      ...people.map(p => String(Object.values(toRows([p])[0])[i]).length)
    )
    return { wch: maxLen + 2 }
  })
  ws['!cols'] = colWidths

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Nomina')
  XLSX.writeFile(wb, 'nomina.xlsx')
}
