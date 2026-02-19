import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import FileUpload from '@/components/upload/FileUpload'
import LLMProviderSelect from '@/components/ui/LLMProviderSelect'
import { getSelectedProvider } from '@/components/ui/LLMProviderSelect'
import type { LLMProvider } from '@/types/interview'

export default function UploadSection() {
  const [jdText, setJdText] = useState('')
  const [showResumeUpload, setShowResumeUpload] = useState(false)
  const [questionCount, setQuestionCount] = useState(5)
  const [provider, setProvider] = useState<LLMProvider>(getSelectedProvider)
  const navigate = useNavigate()

  const handleGenerate = () => {
    navigate('/app')
  }

  return (
    <section id="upload" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-dashed border-gray-300"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h3>
          <p className="text-gray-600">
            Drop your job description here or paste the text
          </p>
        </div>

        <FileUpload onTextExtracted={(text) => setJdText(text)} />

        {jdText && (
          <p className="mt-2 text-sm text-green-600">
            Job description loaded successfully
          </p>
        )}

        <div className="mt-6 mb-6">
          <label className="flex items-center text-gray-700 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showResumeUpload}
              onChange={(e) => setShowResumeUpload(e.target.checked)}
              className="mr-2"
            />
            Upload Resume for personalized questions (optional)
          </label>
          {showResumeUpload && (
            <FileUpload onTextExtracted={() => {}} />
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Provider
            </label>
            <LLMProviderSelect value={provider} onChange={setProvider} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions: {questionCount}
            </label>
            <input
              type="range"
              min={5}
              max={10}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Generate Interview Questions &rarr;
        </button>
      </motion.div>
    </section>
  )
}
