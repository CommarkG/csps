// libs/integrations/speech/types.ts
// @csps-enforces P-META-022 (intent crystallization before action — user corrections teach the system)

export interface SpeechSegment {
  id: string
  text: string
  confidence: number
  timestamp: number
  committed: boolean
}

export interface CorrectionRule {
  wrong: string
  right: string
  context?: string
  learnedAt: number
  applyCount: number
}

export interface SuspiciousFlag {
  segmentId: string
  reason: 'low-confidence' | 'confusion-pattern'
  confidence: number
  text: string
  timestamp: number
}

export interface ReviewItem {
  id: string
  flag: SuspiciousFlag
  originalText: string
  suggestedText?: string
  confirmed: boolean | null
}

export interface ReviewStats {
  pending: number
  confirmed: number
  rejected: number
  totalFlagged: number
}
