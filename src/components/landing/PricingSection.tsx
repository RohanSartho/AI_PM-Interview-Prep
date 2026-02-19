import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try it out with no commitment.',
    features: [
      '5 analyses per day',
      'Basic question generation',
      'Instant feedback',
      'Community support',
    ],
    cta: 'Get Started',
    ctaLink: '/app',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: '$9',
    period: '/mo',
    description: 'For serious PM candidates.',
    badge: 'Most Popular',
    features: [
      'Unlimited analyses',
      'Advanced question generation',
      'Detailed scoring & feedback',
      'Resume-tailored questions',
      'Interview history & analytics',
    ],
    cta: 'Start Basic',
    ctaLink: '/login',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For career changers and coaches.',
    features: [
      'Everything in Basic',
      'Multiple LLM providers',
      'Priority question generation',
      'Export interview transcripts',
      'Team & coaching features',
      'Priority support',
    ],
    cta: 'Start Pro',
    ctaLink: '/login',
    highlighted: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Simple, Transparent Pricing
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-gray-500">
          Start free. Upgrade when you're ready to get serious.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border bg-white p-8 ${
                plan.highlighted
                  ? 'border-gray-900 ring-2 ring-gray-900'
                  : 'border-gray-200'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className={`mt-8 block w-full rounded-lg py-2.5 text-center text-sm font-semibold ${
                  plan.highlighted
                    ? 'bg-gray-900 text-white hover:bg-gray-700'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
