import React, { useEffect } from 'react'
import { Theme } from '../hooks/useTheme'

interface Props {
  isOpen: boolean
  onClose: () => void
  theme: Theme
  onToggle: () => void
}

export const Settings: React.FC<Props> = ({ isOpen, onClose, theme, onToggle }) => {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-elevated z-50 animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
              </svg>
            </div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Configuración</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Apariencia
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ThemeCard
              label="Claro"
              active={theme === 'light'}
              onClick={() => theme !== 'light' && onToggle()}
              icon={<SunIcon />}
              preview={<LightPreview />}
            />
            <ThemeCard
              label="Oscuro"
              active={theme === 'dark'}
              onClick={() => theme !== 'dark' && onToggle()}
              icon={<MoonIcon />}
              preview={<DarkPreview />}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            Preferencia guardada automáticamente
          </p>
        </div>
      </div>
    </>
  )
}

interface ThemeCardProps {
  label: string
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  preview: React.ReactNode
}

const ThemeCard: React.FC<ThemeCardProps> = ({ label, active, onClick, icon, preview }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 w-full text-left ${
      active
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
    }`}
  >
    <div className="w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm">
      {preview}
    </div>
    <div className={`flex items-center gap-1.5 text-xs font-semibold ${
      active ? 'text-primary-700 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'
    }`}>
      <span className={active ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}>
        {icon}
      </span>
      {label}
    </div>
    {active && (
      <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    )}
  </button>
)

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const LightPreview = () => (
  <div className="bg-slate-100 p-2">
    <div className="bg-white rounded border border-slate-200 p-1.5 mb-1">
      <div className="h-1.5 w-10 bg-primary-500 rounded mb-1"/>
      <div className="h-1 w-14 bg-slate-200 rounded"/>
    </div>
    <div className="flex gap-1">
      <div className="flex-1 bg-white rounded border border-slate-200 h-5"/>
      <div className="flex-1 bg-white rounded border border-slate-200 h-5"/>
    </div>
  </div>
)

const DarkPreview = () => (
  <div className="bg-slate-950 p-2">
    <div className="bg-slate-800 rounded border border-slate-700 p-1.5 mb-1">
      <div className="h-1.5 w-10 bg-primary-500 rounded mb-1"/>
      <div className="h-1 w-14 bg-slate-600 rounded"/>
    </div>
    <div className="flex gap-1">
      <div className="flex-1 bg-slate-800 rounded border border-slate-700 h-5"/>
      <div className="flex-1 bg-slate-800 rounded border border-slate-700 h-5"/>
    </div>
  </div>
)
