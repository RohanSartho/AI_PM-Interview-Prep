const steps = [
  {
    step: 1,
    icon: '📋',
    title: 'Paste a Job Description',
    description:
      'Drop in any PM job posting and our AI extracts the role, skills, and key responsibilities.',
  },
  {
    step: 2,
    icon: '🎯',
    title: 'Get Tailored Questions',
    description:
      'We generate a custom mock interview matched to the exact role, seniority level, and company.',
  },
  {
    step: 3,
    icon: '🎤',
    title: 'Practice Your Answers',
    description:
      'Answer each question in an interactive interview session. Take your time or set a timer.',
  },
  {
    step: 4,
    icon: '📊',
    title: 'Get Instant Feedback',
    description:
      'Receive detailed scoring, strengths, areas to improve, and sample answers for every question.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          How It Works
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-gray-500">
          From job description to interview-ready in four simple steps.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                {s.step}
              </div>
              <span className="text-2xl">{s.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
