export type Classification = 'Critical' | 'Non-critical'
export type ComplianceStatus = 'Compliant' | 'Needs Review' | 'Non-compliant'
export type AuditEventType =
  | 'retrain'
  | 'validation'
  | 'human_override'
  | 'firmware_update'
  | 'initial_registration'
  | 'review_approved'
  | 'review_flagged'
  | 'document_upload'

export interface AuditEvent {
  id: string
  timestamp: string
  type: AuditEventType
  description: string
  actor: string
  metadata?: Record<string, string>
}

export interface ModelVersion {
  version: string
  date: string
  description: string
  trainedBy: string
  validatedBy: string
}

export interface Documentation {
  intendedUse: string
  dataSources: string[]
  modelVersionHistory: ModelVersion[]
  regulatoryBasis: string
  riskCategory: string
}

export interface ClassificationCriterion {
  criterion: string
  met: boolean
  explanation: string
}

export interface ClassificationReasoning {
  conclusion: Classification
  criteria: ClassificationCriterion[]
  annex22Reference: string
  reviewedBy: string
  reviewDate: string
}

export interface AISystem {
  id: string
  name: string
  equipment: string
  location: string
  vendor: string
  classification: Classification
  status: ComplianceStatus
  lastReviewed: string
  nextReviewDue: string
  auditTrail: AuditEvent[]
  documentation: Documentation
  classificationReasoning: ClassificationReasoning
  discoverySource: string
}

export interface ActivityFeedItem {
  id: string
  timestamp: string
  type: 'retrain' | 'approval' | 'discovery' | 'flag' | 'review'
  systemName: string
  systemId: string
  description: string
}

export interface DiscoveredSystem {
  id: string
  name: string
  vendor: string
  equipment: string
  location: string
  suggestedClassification: Classification
  inRegistry: boolean
}

export interface DiscoverySource {
  id: string
  name: string
  type: 'aws' | 'mes' | 'vendor_api' | 'opc_ua'
  status: 'connected' | 'error' | 'scanning'
  lastScanned: string
  systemCount: number
  discoveredSystems: DiscoveredSystem[]
}
