import React, { useState } from 'react'
import { Header } from './components/Header'
import { PersonForm } from './components/PersonForm'
import { PayrollTable } from './components/PayrollTable'
import { ToastContainer } from './components/ToastContainer'
import { usePayroll } from './hooks/usePayroll'
import { formatCurrency, formatNumber } from './utils/formatters'
import { CompanyConfig } from './types'

const App: React.FC = () => {
  const {
    people,
    form,
    updateFormField,
    errors,
    editingId,
    toasts,
    totalGeneral,
    precioPerPaquete,
    setPrecioPerPaquete,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    dismissToast,
    addToast,
  } = usePayroll()

  const [rawPrecio, setRawPrecio] = useState('')
  const [company, setCompany] = useState<CompanyConfig>({
    name: 'S.T.C mensajería S.A.S',
    nit: '902060071-1',
    preparedBy: 'Valeria Peña',
  })

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '')
    setRawPrecio(digits)
    setPrecioPerPaquete(digits ? Number(digits) : 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex flex-col">
      <Header />

      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-6 py-6 flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Personas registradas"
            value={formatNumber(people.length)}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            }
            color="bg-primary-50"
          />
          <StatCard
            label="Total paquetes"
            value={formatNumber(people.reduce((s, p) => s + p.totalPackages, 0))}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            }
            color="bg-emerald-50"
          />
          <StatCard
            label="Total a pagar"
            value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalGeneral)}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            }
            color="bg-amber-50"
          />
        </div>

        {/* Company config */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 px-6 py-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Datos de la empresa</p>
                <p className="text-xs text-slate-400">Aparecen en el encabezado del PDF</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 flex-wrap min-w-[320px]">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Empresa
                </label>
                <input
                  type="text"
                  value={company.name}
                  onChange={e => setCompany(c => ({ ...c, name: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm font-semibold text-slate-800 bg-white outline-none transition-all duration-150"
                />
              </div>
              <div className="flex items-center gap-2 min-w-[160px]">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Nit
                </label>
                <input
                  type="text"
                  value={company.nit}
                  onChange={e => setCompany(c => ({ ...c, nit: e.target.value }))}
                  className="w-36 px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm font-mono font-semibold text-slate-800 bg-white outline-none transition-all duration-150"
                />
              </div>
              <div className="flex items-center gap-2 min-w-[200px]">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Elaborado por
                </label>
                <input
                  type="text"
                  value={company.preparedBy}
                  onChange={e => setCompany(c => ({ ...c, preparedBy: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm font-semibold text-slate-800 bg-white outline-none transition-all duration-150"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price config */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 px-6 py-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Constante de precio</p>
                <p className="text-xs text-slate-400">Al ingresar paquetes, el valor se calcula solo</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 flex-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Precio / paquete
                </label>
                <div className="relative flex-1 max-w-[220px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={rawPrecio ? formatNumber(Number(rawPrecio)) : ''}
                    onChange={handlePrecioChange}
                    className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-sm font-semibold text-slate-800 bg-white outline-none transition-all duration-150 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {precioPerPaquete > 0 && (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-50 border border-violet-100 animate-scale-in">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-xs font-bold text-violet-700">
                    {formatCurrency(precioPerPaquete)} × paquetes
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <PersonForm
          form={form}
          errors={errors}
          editingId={editingId}
          precioPerPaquete={precioPerPaquete}
          onFieldChange={updateFormField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <PayrollTable
          people={people}
          totalGeneral={totalGeneral}
          editingId={editingId}
          company={company}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPDFSuccess={() => addToast('PDF generado exitosamente', 'success')}
        />
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-card border border-slate-100 px-5 py-4 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide truncate">{label}</p>
      <p className="text-lg font-extrabold text-slate-900 tabular-nums truncate">{value}</p>
    </div>
  </div>
)

export default App
