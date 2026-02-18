import { useState } from 'react'
import FileUpload from '@/components/upload/FileUpload'

interface JDInputProps {
  onSubmit: (jdText: string, resumeText?: string) => void
  loading: boolean
}

export default function JDInput({ onSubmit, loading }: JDInputProps) {
  const [jdText, setJdText] = useState('')
  const [resumeText, setResumeText] = useState<string | undefined>()
  const [showResume, setShowResume] = useState(false)

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <FileUpload onTextExtracted={(t) => setJdText(t)} />
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Or paste the job description here..."
          rows={10}
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowResume(!showResume)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showResume ? '- Hide resume upload' : '+ Add resume for personalized questions'}
        </button>

        {showResume && (
          <div className="mt-2">
            <FileUpload onTextExtracted={(t) => setResumeText(t)} />
            <textarea
              value={resumeText ?? ''}
              onChange={(e) => setResumeText(e.target.value || undefined)}
              placeholder="Or paste your resume text here..."
              rows={6}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      <button
        onClick={() => onSubmit(jdText, resumeText)}
        disabled={!jdText.trim() || loading}
        className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Job Description'}
      </button>
    </div>
  )
}
