import React from 'react'
import { FormData } from '../types'
import { formatCurrency, formatNumber } from '../utils/formatters'

const stripNonDigits = (s: string) => s.replace(/[^0-9]/g, '')

interface Props {
  form: FormData
  errors: Partial<FormData>
  editingId: string | null
  precioPerPaquete: number
  onFieldChange: (key: keyof FormData, value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

interface FieldProps {
  label: string
  error?: string
  badge?: React.ReactNode
  children: React.ReactNode
}

const Field: React.FC<FieldProps> = ({ label, error, badge, children }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      {badge}
    </div>
    {children}
    {error && (
      <span className="text-xs text-red-500 font-medium flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {error}
      </span>
    )}
  </div>
)

const inputBase =
  'w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium text-slate-800 bg-white transition-all duration-150 outline-none placeholder:text-slate-300'
const inputNormal = `${inputBase} border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100`
const inputError  = `${inputBase} border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100`
const inputAuto   = `${inputBase} border-emerald-200 bg-emerald-50/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100`

export const PersonForm: React.FC<Props> = ({
  form, errors, editingId, precioPerPaquete, onFieldChange, onSubmit, onCancel,
}) => {
  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onFieldChange(key, e.target.value)

  const isAutoCalc = precioPerPaquete > 0
  const computedPreview =
    isAutoCalc && form.totalPackages
      ? `${formatNumber(Number(form.totalPackages) || 0)} × ${formatCurrency(precioPerPaquete)} = ${formatCurrency((Number(form.totalPackages) || 0) * precioPerPaquete)}`
      : null

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {editingId ? 'Editar persona' : 'Agregar persona'}
          </h2>
          <p className="text-xs text-slate-400">
            {isAutoCalc
              ? `Valor se calcula automáticamente · ${formatCurrency(precioPerPaquete)} por paquete`
              : 'Completa todos los campos del formulario'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Field label="Nombre completo" error={errors.name}>
          <input
            type="text"
            placeholder="Juan García"
            value={form.name}
            onChange={set('name')}
            className={errors.name ? inputError : inputNormal}
          />
        </Field>

        <Field label="Cédula" error={errors.cedula}>
          <input
            type="text"
            placeholder="1234567890"
            value={form.cedula}
            onChange={set('cedula')}
            className={errors.cedula ? inputError : inputNormal}
          />
        </Field>

        <Field label="Fecha inicio" error={errors.startDate}>
          <input
            type="date"
            value={form.startDate}
            onChange={set('startDate')}
            className={errors.startDate ? inputError : inputNormal}
          />
        </Field>

        <Field label="Fecha final" error={errors.endDate}>
          <input
            type="date"
            value={form.endDate}
            onChange={set('endDate')}
            className={errors.endDate ? inputError : inputNormal}
          />
        </Field>

        <Field label="Total paquetes" error={errors.totalPackages}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={form.totalPackages ? formatNumber(Number(form.totalPackages)) : ''}
            onChange={e => onFieldChange('totalPackages', stripNonDigits(e.target.value))}
            className={errors.totalPackages ? inputError : inputNormal}
          />
        </Field>

        <Field
          label="Valor (COP)"
          error={errors.value}
          badge={
            isAutoCalc ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Auto
              </span>
            ) : undefined
          }
        >
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={form.value ? formatNumber(Number(form.value)) : ''}
            onChange={e => onFieldChange('value', stripNonDigits(e.target.value))}
            className={errors.value ? inputError : isAutoCalc ? inputAuto : inputNormal}
          />
        </Field>
      </div>

      {computedPreview && (
        <div className="mt-3 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span className="text-xs font-semibold text-emerald-700">{computedPreview}</span>
        </div>
      )}

      <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 active:scale-95"
        >
          {editingId ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Guardar cambios
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Agregar persona
            </>
          )}
        </button>

        {editingId && (
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all duration-200 active:scale-95"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}
