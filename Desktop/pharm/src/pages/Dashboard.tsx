import { useNavigate } from 'react-router-dom'
import { systems, activityFeed } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import ClassificationBadge from '../components/ClassificationBadge'
import type { ActivityFeedItem } from '../types'

// ─── Metric Cards ────────────────────────────────────────────────────────────

const metrics = [
  {
    label: 'Systems Tracked',
    value: 8,
    sub: 'in AI registry',
    color: 'text-gray-900',
    icon: (
      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    label: 'Fully Documented',
    value: 7,
    sub: 'documentation complete',
    color: 'text-gray-900',
    icon: (
      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Needs Review',
    value: 2,
    sub: 'periodic review overdue',
    color: 'text-amber-600',
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    label: 'Non-compliant',
    value: 1,
    sub: 'immediate action required',
    color: 'text-red-600',
    icon: (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

// ─── Activity Feed Helpers ────────────────────────────────────────────────────

function activityIcon(type: ActivityFeedItem['type']) {
  switch (type) {
    case 'retrain':
      return (
        <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      )
    case 'approval':
      return (
        <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    case 'flag':
      return (
        <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        </div>
      )
    case 'discovery':
      return (
        <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      )
    default:
      return (
        <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      )
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">AI System Registry</h1>
        <p className="mt-1 text-sm text-gray-500">
          EU GMP Annex 22 compliance status across all tracked AI systems
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white border border-gray-200 rounded-lg px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{m.label}</p>
                <p className={`mt-1.5 text-3xl font-semibold ${m.color}`}>{m.value}</p>
                <p className="mt-0.5 text-xs text-gray-400">{m.sub}</p>
              </div>
              <div className="mt-0.5">{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Registry Table */}
      <div className="bg-white border border-gray-200 rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">AI Systems Registry</h2>
          <span className="text-xs text-gray-400">{systems.length} systems</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">System</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Classification</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Reviewed</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {systems.map((sys) => (
                <tr
                  key={sys.id}
                  onClick={() => navigate(`/systems/${sys.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-100"
                >
                  <td className="px-6 py-3.5">
                    <div>
                      <p className="font-medium text-gray-900">{sys.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sys.equipment}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <ClassificationBadge classification={sys.classification} />
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={sys.status} />
                  </td>
                  <td className="px-6 py-3.5 text-gray-600 tabular-nums">
                    {formatDate(sys.lastReviewed)}
                  </td>
                  <td className="px-6 py-3.5 tabular-nums">
                    <span
                      className={
                        new Date(sys.nextReviewDue) < new Date()
                          ? 'text-red-600 font-medium'
                          : 'text-gray-600'
                      }
                    >
                      {formatDate(sys.nextReviewDue)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500 text-xs">{sys.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {activityFeed.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/systems/${item.systemId}`)}
              className="flex items-start gap-3.5 px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors duration-100"
            >
              {activityIcon(item.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{item.systemName}</span>{' '}
                  <span className="text-gray-500">— {item.description}</span>
                </p>
              </div>
              <p className="text-xs text-gray-400 shrink-0 mt-0.5 tabular-nums">
                {formatDateTime(item.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
