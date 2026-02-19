import { motion } from 'framer-motion'

const steps = [
  {
    icon: '📄',
    title: 'Upload',
    description: 'Paste or upload your job description and resume',
    color: 'blue',
  },
  {
    icon: '🎯',
    title: 'Get Questions',
    description: 'AI generates tailored interview questions based on the role',
    color: 'purple',
  },
  {
    icon: '💬',
    title: 'Practice',
    description: 'Answer questions and get instant AI feedback',
    color: 'green',
  },
  {
    icon: '📈',
    title: 'Improve',
    description: 'Review detailed feedback and track your progress',
    color: 'orange',
  },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100',
  purple: 'bg-purple-100',
  green: 'bg-green-100',
  orange: 'bg-orange-100',
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">
            Four simple steps to ace your interview
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 cursor-pointer"
            >
              <div
                className={`w-16 h-16 ${colorMap[step.color]} rounded-full flex items-center justify-center mb-6 text-3xl`}
              >
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
