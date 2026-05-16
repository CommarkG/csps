// libs/integrations/speech/detector.ts
// @csps-enforces P-META-022 (intent crystallization before action — user corrections teach the system)
//
// SuspiciousTermDetector: flags speech segments that need human review.
// Triggers: confidence < threshold OR known confusion patterns.

import { SpeechSegment, SuspiciousFlag } from './types'

const CONFIDENCE_THRESHOLD = Number(process.env.SPEECH_BUFFER_CONFIDENCE_THRESHOLD ?? 0.7)

// Known confusion patterns: homophones + domain-specific misrecognitions
const CONFUSION_PATTERNS: RegExp[] = [
  /\b(their|there|they're)\b/i,
  /\b(to|too|two)\b/i,
  /\b(your|you're)\b/i,
  /\b(its|it's)\b/i,
]

export class SuspiciousTermDetector {
  private threshold: number

  constructor(threshold = CONFIDENCE_THRESHOLD) {
    this.threshold = threshold
  }

  scan(segments: SpeechSegment[]): SuspiciousFlag[] {
    const flags: SuspiciousFlag[] = []

    for (const segment of segments) {
      if (segment.confidence < this.threshold) {
        flags.push({
          segmentId: segment.id,
          reason: 'low-confidence',
          confidence: segment.confidence,
          text: segment.text,
          timestamp: segment.timestamp,
        })
        continue
      }

      for (const pattern of CONFUSION_PATTERNS) {
        if (pattern.test(segment.text)) {
          flags.push({
            segmentId: segment.id,
            reason: 'confusion-pattern',
            confidence: segment.confidence,
            text: segment.text,
            timestamp: segment.timestamp,
          })
          break
        }
      }
    }

    return flags
  }
}
