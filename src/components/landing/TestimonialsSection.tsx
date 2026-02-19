const testimonials = [
  {
    quote:
      'I used this to prep for my Google APM interview and felt so much more confident going in. The tailored questions were spot-on.',
    name: 'Sarah Chen',
    role: 'Product Manager at Google',
    initials: 'SC',
    color: 'bg-blue-500',
  },
  {
    quote:
      'The instant feedback helped me realize I wasn\'t structuring my answers well. After a week of practice, I landed my dream PM role.',
    name: 'Marcus Johnson',
    role: 'Senior PM at Stripe',
    initials: 'MJ',
    color: 'bg-emerald-500',
  },
  {
    quote:
      'Way better than generic PM interview question lists. It actually reads the JD and asks relevant questions. Absolute game-changer.',
    name: 'Priya Patel',
    role: 'Product Lead at Meta',
    initials: 'PP',
    color: 'bg-violet-500',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          What PMs Are Saying
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-gray-500">
          Join hundreds of product managers who landed their next role.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-gray-100 bg-gray-50 p-6"
            >
              <p className="text-sm leading-relaxed text-gray-600">
                "{t.quote}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${t.color}`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
