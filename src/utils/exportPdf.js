import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * Renders a DOM element to a paginated A4 PDF and triggers a download.
 * No browser print dialog is involved, jsPDF's save() writes the file directly.
 *
 * @param {HTMLElement} element the DOM node to capture
 * @param {string} filename filename for the downloaded PDF (with or without .pdf)
 * @param {string} [title] optional heading printed at the top of the PDF
 */
export async function exportElementToPdf(element, filename, title) {
  if (!element) throw new Error('exportElementToPdf: elemento não encontrado')

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 24

  let cursorY = margin

  if (title) {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(16)
    pdf.setTextColor(15, 47, 82) // navy-deep
    pdf.text(title, margin, cursorY + 14)
    cursorY += 30
    pdf.setDrawColor(15, 47, 82)
    pdf.setLineWidth(1.5)
    pdf.line(margin, cursorY, pageWidth - margin, cursorY)
    cursorY += 14
  }

  const usableWidth = pageWidth - margin * 2
  const imgWidth = usableWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  const usableHeightFirstPage = pageHeight - cursorY - margin
  const usableHeightOtherPages = pageHeight - margin * 2

  if (imgHeight <= usableHeightFirstPage) {
    pdf.addImage(imgData, 'PNG', margin, cursorY, imgWidth, imgHeight)
  } else {
    // Paginate by slicing the source canvas into page-sized chunks.
    const pxPerPtFirst = canvas.width / imgWidth
    let renderedHeightPx = 0
    let firstPage = true

    while (renderedHeightPx < canvas.height) {
      const availableHeightPt = firstPage ? usableHeightFirstPage : usableHeightOtherPages
      const sliceHeightPx = Math.min(availableHeightPt * pxPerPtFirst, canvas.height - renderedHeightPx)

      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = canvas.width
      sliceCanvas.height = sliceHeightPx
      const ctx = sliceCanvas.getContext('2d')
      ctx.drawImage(
        canvas,
        0, renderedHeightPx, canvas.width, sliceHeightPx,
        0, 0, canvas.width, sliceHeightPx
      )
      const sliceData = sliceCanvas.toDataURL('image/png')
      const sliceHeightPt = sliceHeightPx / pxPerPtFirst

      const y = firstPage ? cursorY : margin
      pdf.addImage(sliceData, 'PNG', margin, y, imgWidth, sliceHeightPt)

      renderedHeightPx += sliceHeightPx
      firstPage = false

      if (renderedHeightPx < canvas.height) {
        pdf.addPage()
      }
    }
  }

  const finalName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  pdf.save(finalName)
}
