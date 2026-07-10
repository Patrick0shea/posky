import { useParams, useNavigate } from 'react-router-dom'
import { systems } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import ClassificationBadge from '../components/ClassificationBadge'
import type { AuditEvent, AuditEventType } from '../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) +
    ' UTC'
  )
}

// ─── Audit Event Helpers ─────────────────────────────────────────────────────

const auditTypeConfig: Record<
  AuditEventType,
  { label: string; dotClass: string; lineClass: string }
> = {
  initial_registration: { label: 'Registered', dotClass: 'bg-teal-600 border-teal-200', lineClass: '' },
  retrain: { label: 'Model Retrain', dotClass: 'bg-teal-500 border-teal-200', lineClass: '' },
  validation: { label: 'Validation', dotClass: 'bg-emerald-500 border-emerald-200', lineClass: '' },
  human_override: { label: 'Human Override', dotClass: 'bg-orange-400 border-orange-200', lineClass: '' },
  firmware_update: { label: 'Firmware Update', dotClass: 'bg-blue-500 border-blue-200', lineClass: '' },
  review_approved: { label: 'Review Approved', dotClass: 'bg-emerald-500 border-emerald-200', lineClass: '' },
  review_flagged: { label: 'Review Flagged', dotClass: 'bg-red-500 border-red-200', lineClass: '' },
  document_upload: { label: 'Document Upload', dotClass: 'bg-gray-400 border-gray-200', lineClass: '' },
}

function AuditEventRow({ event, isLast }: { event: AuditEvent; isLast: boolean }) {
  const cfg = auditTypeConfig[event.type]
  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full border-2 mt-1 shrink-0 ${cfg.dotClass}`} />
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
      </div>
      {/* Content */}
      <div className={`pb-6 flex-1 min-w-0 ${isLast ? '' : ''}`}>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{cfg.label}</span>
          <span className="text-xs text-gray-400 tabular-nums">{formatDateTime(event.timestamp)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-800 leading-relaxed">{event.description}</p>
        <p className="mt-0.5 text-xs text-gray-400">by {event.actor}</p>
        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {Object.entries(event.metadata).map(([k, v]) => (
              <div key={k} className="text-xs">
                <span className="text-gray-400">{k}: </span>
                <span className="text-gray-600 font-medium">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SystemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const system = systems.find((s) => s.id === id)

  if (!system) {
    return (
      <div className="px-8 py-8">
        <p className="text-sm text-gray-500">System not found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm text-teal-700 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Registry
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-xl font-semibold text-gray-900 flex-1">{system.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <ClassificationBadge classification={system.classification} />
            <StatusBadge status={system.status} />
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          <span className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Equipment:</span> {system.equipment}
          </span>
          <span className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Location:</span> {system.location}
          </span>
          <span className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Vendor:</span> {system.vendor}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          <span className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Last reviewed:</span> {formatDate(system.lastReviewed)}
          </span>
          <span className={`text-sm ${new Date(system.nextReviewDue) < new Date() ? 'text-red-600' : 'text-gray-500'}`}>
            <span className="font-medium text-gray-700">Next due:</span> {formatDate(system.nextReviewDue)}
            {new Date(system.nextReviewDue) < new Date() && (
              <span className="ml-1.5 text-xs font-semibold text-red-600">OVERDUE</span>
            )}
          </span>
          <span className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Discovered via:</span> {system.discoverySource}
          </span>
        </div>
      </div>

      {/* Non-compliant banner */}
      {system.status === 'Non-compliant' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-5 py-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Compliance Action Required</p>
              <p className="text-sm text-red-700 mt-0.5">
                This system is operating in a GMP-regulated context without a completed validation protocol. Remediation is in progress under VAL-BR-2024-08.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Needs review banner */}
      {system.status === 'Needs Review' && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-5 py-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">Periodic Review Required</p>
              <p className="text-sm text-amber-700 mt-0.5">
                This system has been flagged for review. See the audit trail for details.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Audit Trail */}
        <Section title="Audit Trail">
          <div className="pt-1">
            {[...system.auditTrail]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((event, i, arr) => (
                <AuditEventRow key={event.id} event={event} isLast={i === arr.length - 1} />
              ))}
          </div>
        </Section>

        {/* Documentation Packet */}
        <Section title="Documentation Packet">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Intended Use</p>
              <p className="text-sm text-gray-700 leading-relaxed">{system.documentation.intendedUse}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Risk Category</p>
              <p className="text-sm text-gray-700">{system.documentation.riskCategory}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Data Sources</p>
              <ul className="space-y-1.5">
                {system.documentation.dataSources.map((src) => (
                  <li key={src} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-3.5 h-3.5 text-gray-300 mt-1 shrink-0" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    {src}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Regulatory Basis</p>
              <p className="text-sm text-gray-700">{system.documentation.regulatoryBasis}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Model Version History</p>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Version</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Date</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Description</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Trained by</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Validated by</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[...system.documentation.modelVersionHistory]
                      .reverse()
                      .map((v) => (
                        <tr key={v.version}>
                          <td className="px-4 py-2.5 font-mono text-xs font-semibold text-teal-700">{v.version}</td>
                          <td className="px-4 py-2.5 text-gray-500 text-xs tabular-nums whitespace-nowrap">{formatDate(v.date)}</td>
                          <td className="px-4 py-2.5 text-gray-700 text-xs">{v.description}</td>
                          <td className="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">{v.trainedBy}</td>
                          <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                            <span className={v.validatedBy === 'NOT VALIDATED' ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                              {v.validatedBy}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Section>

        {/* Classification Reasoning */}
        <Section title="Classification Reasoning">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Conclusion:</span>
              <ClassificationBadge classification={system.classificationReasoning.conclusion} />
              <span className="text-xs text-gray-400">
                per {system.classificationReasoning.annex22Reference}
              </span>
            </div>
            <div className="space-y-3">
              {system.classificationReasoning.criteria.map((c) => (
                <div
                  key={c.criterion}
                  className="flex gap-3 p-3.5 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${c.met ? 'bg-emerald-100' : 'bg-gray-200'}`}>
                    {c.met ? (
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{c.criterion}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Reviewed by: <span className="text-gray-600">{system.classificationReasoning.reviewedBy}</span>
              </span>
              <span className="text-xs text-gray-400">
                Review date: <span className="text-gray-600">{formatDate(system.classificationReasoning.reviewDate)}</span>
              </span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
