import React from 'react'
import { Toast } from '../types'

interface Props {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

const icons = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
}

const styles = {
  success: 'bg-emerald-600 text-white shadow-emerald-600/30',
  error: 'bg-red-500 text-white shadow-red-500/30',
  info: 'bg-slate-700 text-white shadow-slate-700/30',
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map(toast => (
      <div
        key={toast.id}
        className={`
          pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl
          shadow-lg text-sm font-semibold animate-slide-in
          ${styles[toast.type]}
        `}
      >
        {icons[toast.type]}
        <span>{toast.message}</span>
        <button
          onClick={() => onDismiss(toast.id)}
          className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    ))}
  </div>
)
