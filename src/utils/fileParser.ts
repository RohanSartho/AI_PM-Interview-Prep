import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'

// PDF.js worker — bundled locally via Vite ?url import
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function extractText(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large (max 10MB). Please try a smaller file or paste the text directly.')
  }

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
  try {
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

    const result = pages.join('\n\n').trim()
    if (!result) {
      throw new Error('No text found in PDF. The file may be scanned/image-based. Please paste the text instead.')
    }
    return result
  } catch (e) {
    if (e instanceof Error && e.message.includes('No text found')) throw e
    console.error('PDF parsing error:', e)
    throw new Error('Failed to read PDF. Please try copy-pasting the text instead.')
  }
}

async function extractFromDOCX(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value
}
