import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// PDF.js worker — uses CDN to avoid bundling issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export async function extractText(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'pdf':
      return extractFromPDF(file)
    case 'docx':
      return extractFromDOCX(file)
    case 'txt':
      return file.text()
    default:
      throw new Error(`Unsupported file type: .${ext}`)
  }
}

async function extractFromPDF(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(text)
  }

  return pages.join('\n\n')
}

async function extractFromDOCX(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value
}
