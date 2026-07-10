import type { Classification } from '../types'

interface Props {
  classification: Classification
}

export default function ClassificationBadge({ classification }: Props) {
  const isCritical = classification === 'Critical'
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${
        isCritical
          ? 'bg-teal-50 text-teal-700 border border-teal-200'
          : 'bg-gray-100 text-gray-600 border border-gray-200'
      }`}
    >
      {classification.toUpperCase()}
    </span>
  )
}
