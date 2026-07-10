import type { ComplianceStatus } from '../types'

interface Props {
  status: ComplianceStatus
  size?: 'sm' | 'md'
}

const config: Record<ComplianceStatus, { dot: string; text: string; bg: string; label: string }> = {
  Compliant: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    label: 'Compliant',
  },
  'Needs Review': {
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    label: 'Needs Review',
  },
  'Non-compliant': {
    dot: 'bg-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
    label: 'Non-compliant',
  },
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const c = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
