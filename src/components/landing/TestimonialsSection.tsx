import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior PM @ Stripe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    text: 'Got 3 job offers after practicing here. The feedback was spot-on!',
    rating: 5,
  },
  {
    name: 'Marcus Williams',
    role: 'PM @ Google',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    text: 'Better than expensive interview coaches. Used it for my Google PM interview.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'PM @ Meta',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    text: 'The AI feedback helped me structure my STAR answers perfectly.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Loved by Product Managers
          </h2>
          <p className="text-gray-600 text-lg">
            Join thousands who landed their dream PM role
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
              <div className="flex mb-4 text-yellow-500">
                {'⭐'.repeat(testimonial.rating)}
              </div>
              <p className="text-gray-700">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
