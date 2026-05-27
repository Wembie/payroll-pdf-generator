export interface Person {
  id: string
  name: string
  cedula: string
  startDate: string
  endDate: string
  totalPackages: number
  value: number
}

export interface FormData {
  name: string
  cedula: string
  startDate: string
  endDate: string
  totalPackages: string
  value: string
}

export interface CompanyConfig {
  name: string
  nit: string
  preparedBy: string
}

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}
