import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Ace Your PM Interview
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your job description. Get personalized interview questions.
            Practice with AI feedback.
          </p>

          <a
            href="#upload"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg transition"
          >
            Try Free Now &rarr;
          </a>
          <p className="mt-4 text-sm text-gray-500">
            No signup required. 5 free tries per day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-600">Interview Practice Platform</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
