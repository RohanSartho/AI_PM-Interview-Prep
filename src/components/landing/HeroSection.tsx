import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Ace Your PM Interview
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
          Paste a job description, get a tailored mock interview powered by AI.
          Practice behavioral, technical, and strategic questions — then get
          instant, actionable feedback.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/app"
            className="rounded-lg bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-lg hover:bg-gray-100"
          >
            Try Free Now
          </Link>
          <a
            href="#pricing"
            className="rounded-lg border border-gray-600 px-8 py-3 text-sm font-semibold text-gray-300 hover:border-gray-400 hover:text-white"
          >
            See Pricing
          </a>
        </div>
      </div>
    </section>
  )
}
