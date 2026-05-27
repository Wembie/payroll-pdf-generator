import React from 'react'
import { Person, CompanyConfig } from '../types'
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters'
import { generatePDF } from '../utils/pdfGenerator'

interface Props {
  people: Person[]
  totalGeneral: number
  editingId: string | null
  company: CompanyConfig
  onEdit: (person: Person) => void
  onDelete: (id: string) => void
  onPDFSuccess: () => void
}

export const PayrollTable: React.FC<Props> = ({
  people,
  totalGeneral,
  editingId,
  company,
  onEdit,
  onDelete,
  onPDFSuccess,
}) => {
  const handleGenerate = () => {
    if (people.length === 0) return
    generatePDF(people, totalGeneral, company)
    onPDFSuccess()
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-fade-in">
      {/* Table header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="3" y1="15" x2="21" y2="15"/>
              <line x1="9" y1="9" x2="9" y2="21"/>
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Nómina de personas</h2>
            <p className="text-xs text-slate-400">
              {people.length === 0
                ? 'Sin registros'
                : `${people.length} ${people.length === 1 ? 'registro' : 'registros'}`}
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={people.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 active:scale-95"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Generar PDF
        </button>
      </div>

      {people.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['#', 'Nombre', 'Cédula', 'F. Inicio', 'F. Final', 'Paquetes', 'Valor', 'Firma', ''].map(
                    (col, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {people.map((person, index) => (
                  <TableRow
                    key={person.id}
                    person={person}
                    index={index}
                    isEditing={editingId === person.id}
                    onEdit={() => onEdit(person)}
                    onDelete={() => onDelete(person.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Total bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-50/50 border-t border-primary-100">
            <span className="text-sm font-semibold text-primary-700 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Total general
            </span>
            <span className="text-lg font-extrabold text-primary-800 tabular-nums">
              {formatCurrency(totalGeneral)}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

interface RowProps {
  person: Person
  index: number
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
}

const TableRow: React.FC<RowProps> = ({ person, index, isEditing, onEdit, onDelete }) => (
  <tr
    className={`group transition-colors duration-100 ${
      isEditing ? 'bg-primary-50/60 ring-1 ring-inset ring-primary-200' : 'hover:bg-slate-50/80'
    }`}
  >
    <td className="px-4 py-3 text-xs font-bold text-slate-400 tabular-nums">{index + 1}</td>
    <td className="px-4 py-3">
      <span className="text-sm font-semibold text-slate-800">{person.name}</span>
    </td>
    <td className="px-4 py-3">
      <span className="text-sm text-slate-600 font-mono">{person.cedula}</span>
    </td>
    <td className="px-4 py-3">
      <span className="text-sm text-slate-600">{formatDate(person.startDate)}</span>
    </td>
    <td className="px-4 py-3">
      <span className="text-sm text-slate-600">{formatDate(person.endDate)}</span>
    </td>
    <td className="px-4 py-3">
      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
        {formatNumber(person.totalPackages)}
      </span>
    </td>
    <td className="px-4 py-3">
      <span className="text-sm font-bold text-slate-800 tabular-nums">
        {formatCurrency(person.value)}
      </span>
    </td>
    <td className="px-4 py-3 min-w-[120px]">
      <div className="border-b-2 border-dashed border-slate-200 mt-4 mx-2" />
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={onEdit}
          title="Editar"
          className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          onClick={onDelete}
          title="Eliminar"
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </td>
  </tr>
)

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>
    <p className="text-sm font-semibold text-slate-500">Sin personas agregadas</p>
    <p className="text-xs text-slate-400 mt-1">Completa el formulario para agregar la primera persona</p>
  </div>
)
