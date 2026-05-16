import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Person } from '../types'
import { formatCurrency, formatDate, formatDateLong } from './formatters'

export function generatePDF(people: Person[], totalGeneral: number): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14

  // ── Background ─────────────────────────────────────────────
  doc.setFillColor(248, 250, 252)
  doc.rect(0, 0, pageW, pageH, 'F')

  // ── Header bar ─────────────────────────────────────────────
  doc.setFillColor(79, 70, 229)
  doc.roundedRect(margin, 8, pageW - margin * 2, 22, 3, 3, 'F')

  // Logo circle
  doc.setFillColor(255, 255, 255, 0.2)
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(0.5)
  doc.circle(margin + 11, 19, 7, 'S')

  // Logo letter
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('FF', margin + 7.5, 22.5)

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('FirmaFlow', margin + 22, 17)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(199, 210, 254)
  doc.text('Generador de Nóminas y Comprobantes PDF', margin + 22, 23)

  // Date right-aligned
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(199, 210, 254)
  const dateStr = formatDateLong(new Date())
  doc.text(`Fecha: ${dateStr}`, pageW - margin - 2, 17, { align: 'right' })
  doc.text(`Total registros: ${people.length}`, pageW - margin - 2, 23, { align: 'right' })

  // ── Table ───────────────────────────────────────────────────
  const headers = [
    ['#', 'Nombre Completo', 'Cédula', 'Fecha Inicio', 'Fecha Final', 'Total Paquetes', 'Valor', 'Firma'],
  ]

  const rows = people.map((p, i) => [
    (i + 1).toString(),
    p.name,
    p.cedula,
    formatDate(p.startDate),
    formatDate(p.endDate),
    p.totalPackages.toString(),
    formatCurrency(p.value),
    '',
  ])

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 35,
    margin: { left: margin, right: margin },
    tableWidth: pageW - margin * 2,
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
      textColor: [30, 41, 59],
      valign: 'middle',
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [71, 85, 105],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 55 },
      2: { halign: 'center', cellWidth: 28 },
      3: { halign: 'center', cellWidth: 24 },
      4: { halign: 'center', cellWidth: 24 },
      5: { halign: 'center', cellWidth: 22 },
      6: { halign: 'right', cellWidth: 28 },
      7: { cellWidth: 'auto' },
    },
    didDrawCell: (data) => {
      if (data.column.index === 7 && data.section === 'body') {
        const { x, y, width, height } = data.cell
        doc.setDrawColor(148, 163, 184)
        doc.setLineWidth(0.5)
        const lineY = y + height - 4
        doc.line(x + 6, lineY, x + width - 6, lineY)
      }
    },
  })

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY

  // ── Total bar ───────────────────────────────────────────────
  const totalBarY = finalY + 3
  doc.setFillColor(241, 245, 249)
  doc.roundedRect(margin, totalBarY, pageW - margin * 2, 10, 2, 2, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.roundedRect(margin, totalBarY, pageW - margin * 2, 10, 2, 2, 'S')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(79, 70, 229)
  doc.text('TOTAL GENERAL:', margin + 4, totalBarY + 6.5)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 41, 59)
  doc.text(formatCurrency(totalGeneral), pageW - margin - 4, totalBarY + 6.5, { align: 'right' })

  // ── Footer ──────────────────────────────────────────────────
  const footerY = pageH - 14
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(margin, footerY - 2, pageW - margin, footerY - 2)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('Elaborado por: Valeria Peña', margin, footerY + 3)

  doc.setFont('helvetica', 'normal')
  doc.text(`Generado el ${dateStr}`, pageW / 2, footerY + 3, { align: 'center' })

  // Signature zone right
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(7)
  doc.text('Firma autorizada:', pageW - margin - 50, footerY - 1, { align: 'left' })
  doc.setDrawColor(148, 163, 184)
  doc.setLineWidth(0.4)
  doc.line(pageW - margin - 50, footerY + 3, pageW - margin, footerY + 3)

  doc.save(`FirmaFlow_Nomina_${new Date().toISOString().split('T')[0]}.pdf`)
}
