import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { discoverySources } from '../data/mockData'
import type { DiscoverySource, DiscoveredSystem } from '../types'
import ClassificationBadge from '../components/ClassificationBadge'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Source Type Icon ─────────────────────────────────────────────────────────

function SourceIcon({ type }: { type: DiscoverySource['type'] }) {
  const base = 'w-9 h-9 rounded-lg flex items-center justify-center shrink-0'
  switch (type) {
    case 'aws':
      return (
        <div className={`${base} bg-amber-50 border border-amber-200`}>
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
      )
    case 'mes':
      return (
        <div className={`${base} bg-blue-50 border border-blue-200`}>
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      )
    case 'vendor_api':
      return (
        <div className={`${base} bg-teal-50 border border-teal-200`}>
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )
    case 'opc_ua':
      return (
        <div className={`${base} bg-purple-50 border border-purple-200`}>
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
      )
  }
}

// ─── Discovered System Row ────────────────────────────────────────────────────

function DiscoveredSystemRow({
  sys,
  onAdd,
  added,
}: {
  sys: DiscoveredSystem
  onAdd: (id: string) => void
  added: boolean
}) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-4 py-3 px-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-gray-900">{sys.name}</p>
          <ClassificationBadge classification={sys.suggestedClassification} />
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {sys.vendor} · {sys.equipment} · {sys.location}
        </p>
      </div>

      {sys.inRegistry ? (
        <button
          onClick={() => {
            // find system id
            navigate('/')
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-md px-3 py-1.5 hover:bg-teal-100 transition-colors shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          In Registry
        </button>
      ) : added ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5 shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Added
        </span>
      ) : (
        <button
          onClick={() => onAdd(sys.id)}
          className="flex items-center gap-1.5 text-xs font-medium text-white bg-teal-700 rounded-md px-3 py-1.5 hover:bg-teal-800 transition-colors shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add to Registry
        </button>
      )}
    </div>
  )
}

// ─── Source Card ──────────────────────────────────────────────────────────────

function SourceCard({
  source,
  addedIds,
  onAdd,
}: {
  source: DiscoverySource
  addedIds: Set<string>
  onAdd: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const pendingCount = source.discoveredSystems.filter((s) => !s.inRegistry && !addedIds.has(s.id)).length

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <SourceIcon type={source.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">{source.name}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                {pendingCount} unregistered
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {source.systemCount} AI systems found · Last scanned {formatDateTime(source.lastScanned)}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded rows */}
      {expanded && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {source.discoveredSystems.map((sys) => (
            <DiscoveredSystemRow
              key={sys.id}
              sys={sys}
              onAdd={onAdd}
              added={addedIds.has(sys.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Discovery() {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  const totalFound = discoverySources.reduce((sum, s) => sum + s.systemCount, 0)
  const totalUnregistered = discoverySources
    .flatMap((s) => s.discoveredSystems)
    .filter((s) => !s.inRegistry).length

  function handleAdd(id: string) {
    setAddedIds((prev) => new Set([...prev, id]))
  }

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">AI System Discovery</h1>
        <p className="mt-1 text-sm text-gray-500">
          Auto-discovery scans connected infrastructure sources for AI systems not yet in the registry.
        </p>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sources Connected</p>
          <p className="mt-1.5 text-3xl font-semibold text-gray-900">{discoverySources.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">AI Systems Found</p>
          <p className="mt-1.5 text-3xl font-semibold text-gray-900">{totalFound}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending Registration</p>
          <p className="mt-1.5 text-3xl font-semibold text-amber-600">{Math.max(0, totalUnregistered - addedIds.size)}</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 bg-teal-50 border border-teal-200 rounded-lg px-5 py-3.5 flex items-start gap-3">
        <svg className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-teal-800">
          Discovery scans run automatically every 6 hours. Systems detected with AI inference endpoints or ML model artifacts are surfaced here for review and registration under Annex 22.
        </p>
      </div>

      {/* Source Cards */}
      <div className="space-y-3">
        {discoverySources.map((source) => (
          <SourceCard
            key={source.id}
            source={source}
            addedIds={addedIds}
            onAdd={handleAdd}
          />
        ))}
      </div>
    </div>
  )
}
