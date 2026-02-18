import { useState } from 'react'
import FileUpload from '@/components/upload/FileUpload'

interface JDInputProps {
  onSubmit: (text: string) => void
  loading: boolean
}

export default function JDInput({ onSubmit, loading }: JDInputProps) {
  const [text, setText] = useState('')

  return (
    <div className="space-y-4">
      <FileUpload onTextExtracted={(t) => setText(t)} />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Or paste the job description here..."
        rows={12}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
      />

      <button
        onClick={() => onSubmit(text)}
        disabled={!text.trim() || loading}
        className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Job Description'}
      </button>
    </div>
  )
}
