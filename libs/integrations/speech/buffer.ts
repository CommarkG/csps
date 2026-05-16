// libs/integrations/speech/buffer.ts
// @csps-enforces P-META-022 (intent crystallization before action — user corrections teach the system)
//
// SpeechBuffer: captures raw STT output + confidence scores.
// Holds uncommitted segments until explicitly committed.
// Committed segments are immutable; use clear() to reset.

import { SpeechSegment } from './types'

const CONFIDENCE_THRESHOLD = Number(process.env.SPEECH_BUFFER_CONFIDENCE_THRESHOLD ?? 0.7)

let _segmentCounter = 0

export class SpeechBuffer {
  private segments: SpeechSegment[] = []

  addSegment(text: string, confidence: number): void {
    this.segments.push({
      id: `seg-${Date.now()}-${++_segmentCounter}`,
      text,
      confidence,
      timestamp: Date.now(),
      committed: false,
    })
  }

  getBuffered(): SpeechSegment[] {
    return this.segments.filter(s => !s.committed)
  }

  getAll(): SpeechSegment[] {
    return [...this.segments]
  }

  commit(): void {
    this.segments = this.segments.map(s => ({ ...s, committed: true }))
  }

  clear(): void {
    this.segments = []
  }

  get confidenceThreshold(): number {
    return CONFIDENCE_THRESHOLD
  }
}
