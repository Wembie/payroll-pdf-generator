import { useState, useCallback } from 'react'
import { Person, FormData, Toast } from '../types'
import { generateId } from '../utils/formatters'

const emptyForm: FormData = {
  name: '',
  cedula: '',
  startDate: '',
  endDate: '',
  totalPackages: '',
  value: '',
}

export function usePayroll() {
  const [people, setPeople] = useState<Person[]>([])
  const [form, setForm] = useState<FormData>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = generateId()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const validate = useCallback((data: FormData): Partial<FormData> => {
    const errs: Partial<FormData> = {}
    if (!data.name.trim()) errs.name = 'Nombre requerido'
    if (!data.cedula.trim()) errs.cedula = 'Cédula requerida'
    if (!data.startDate) errs.startDate = 'Fecha inicio requerida'
    if (!data.endDate) errs.endDate = 'Fecha final requerida'
    if (data.startDate && data.endDate && data.startDate > data.endDate)
      errs.endDate = 'Fecha final debe ser mayor'
    if (!data.totalPackages || Number(data.totalPackages) <= 0)
      errs.totalPackages = 'Total paquetes inválido'
    if (!data.value || Number(data.value) <= 0)
      errs.value = 'Valor inválido'
    return errs
  }, [])

  const handleSubmit = useCallback(() => {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      addToast('Corrige los errores del formulario', 'error')
      return
    }
    setErrors({})

    const person: Person = {
      id: editingId ?? generateId(),
      name: form.name.trim(),
      cedula: form.cedula.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      totalPackages: Number(form.totalPackages),
      value: Number(form.value),
    }

    if (editingId) {
      setPeople(prev => prev.map(p => (p.id === editingId ? person : p)))
      setEditingId(null)
      addToast('Persona actualizada', 'success')
    } else {
      setPeople(prev => [...prev, person])
      addToast('Persona agregada', 'success')
    }

    setForm(emptyForm)
  }, [form, editingId, validate, addToast])

  const handleEdit = useCallback((person: Person) => {
    setForm({
      name: person.name,
      cedula: person.cedula,
      startDate: person.startDate,
      endDate: person.endDate,
      totalPackages: person.totalPackages.toString(),
      value: person.value.toString(),
    })
    setEditingId(person.id)
    setErrors({})
  }, [])

  const handleDelete = useCallback((id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setForm(emptyForm)
    }
    addToast('Persona eliminada', 'info')
  }, [editingId, addToast])

  const handleCancel = useCallback(() => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
  }, [])

  const totalGeneral = people.reduce((sum, p) => sum + p.value, 0)

  return {
    people,
    form,
    setForm,
    errors,
    editingId,
    toasts,
    totalGeneral,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    dismissToast,
    addToast,
  }
}
