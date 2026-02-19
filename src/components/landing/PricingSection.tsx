import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Free',
    price: 0,
    features: [
      '5 interviews per day',
      'Basic feedback',
      'Groq LLM',
      'All question types',
    ],
    cta: 'Start Free',
    ctaLink: '/app',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: 9,
    badge: 'MOST POPULAR',
    features: [
      'Unlimited interviews',
      'Detailed feedback',
      'All LLM providers',
      'Progress dashboard',
      'Priority support',
    ],
    cta: 'Upgrade to Basic',
    ctaLink: '/login',
    highlighted: true,
  },
  {
    name: 'Professional',
    price: 29,
    features: [
      'Everything in Basic',
      'Custom templates',
      'Interview recordings',
      'Company insights',
      'Dedicated support',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/login',
    highlighted: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 text-lg">
            Choose the plan that's right for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`rounded-2xl shadow-xl p-8 relative ${
                tier.highlighted
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white transform scale-105'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  {tier.badge}
                </div>
              )}

              <div className="text-center mb-8">
                <h3
                  className={`text-2xl font-bold mb-2 ${tier.highlighted ? '' : 'text-gray-900'}`}
                >
                  {tier.name}
                </h3>
                <div
                  className={`text-5xl font-bold mb-2 ${tier.highlighted ? '' : 'text-gray-900'}`}
                >
                  ${tier.price}
                </div>
                <div
                  className={
                    tier.highlighted ? 'opacity-90' : 'text-gray-600'
                  }
                >
                  per month
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 shrink-0 ${tier.highlighted ? '' : 'text-green-500'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={tier.ctaLink}
                className={`block w-full py-3 rounded-lg font-semibold text-center transition ${
                  tier.highlighted
                    ? 'bg-white text-purple-700 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
