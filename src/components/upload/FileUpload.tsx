import { useCallback, useState, type ChangeEvent } from 'react'
import { extractText } from '@/utils/fileParser'

interface FileUploadProps {
  onTextExtracted: (text: string) => void
}

export default function FileUpload({ onTextExtracted }: FileUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setLoading(true)
      setError(null)
      setFileName(file.name)

      try {
        const text = await extractText(file)
        onTextExtracted(text)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file')
      } finally {
        setLoading(false)
      }
    },
    [onTextExtracted],
  )

  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFile}
          className="hidden"
        />
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {loading
              ? 'Parsing...'
              : fileName
                ? fileName
                : 'Click to upload a JD (PDF, DOCX, or TXT)'}
          </p>
          {!loading && (
            <p className="text-xs text-gray-400">or paste text directly below</p>
          )}
        </div>
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
