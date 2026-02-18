import type { LLMProvider } from '@/types/interview'

const STORAGE_KEY = 'llm_provider'

const PROVIDERS: { value: LLMProvider; label: string; badge: string; description: string }[] = [
  {
    value: 'anthropic',
    label: 'Claude (Anthropic)',
    badge: 'Paid',
    description: 'Best quality, paid credits',
  },
  {
    value: 'groq',
    label: 'Groq',
    badge: 'Free',
    description: 'Fast and free (14k/day limit)',
  },
  {
    value: 'openrouter',
    label: 'OpenRouter',
    badge: 'Pay-per-use',
    description: 'Multiple models, pay-as-you-go',
  },
]

export function getSelectedProvider(): LLMProvider {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'anthropic' || stored === 'groq' || stored === 'openrouter') return stored
  return 'anthropic'
}

export function getProviderLabel(provider: LLMProvider): string {
  return PROVIDERS.find((p) => p.value === provider)?.label ?? provider
}

interface Props {
  value: LLMProvider
  onChange: (provider: LLMProvider) => void
}

export default function LLMProviderSelect({ value, onChange }: Props) {
  const handleChange = (provider: LLMProvider) => {
    localStorage.setItem(STORAGE_KEY, provider)
    onChange(provider)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">AI Provider</p>
      <div className="flex flex-col gap-2">
        {PROVIDERS.map((p) => (
          <label
            key={p.value}
            className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
              value === p.value
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="llm-provider"
              value={p.value}
              checked={value === p.value}
              onChange={() => handleChange(p.value)}
              className="sr-only"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-900">{p.label}</span>
              <span className="ml-2 text-xs text-gray-400">{p.description}</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                p.badge === 'Free'
                  ? 'bg-green-100 text-green-700'
                  : p.badge === 'Paid'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
              }`}
            >
              {p.badge}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
