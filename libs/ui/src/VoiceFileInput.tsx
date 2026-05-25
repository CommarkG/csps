// WHO: Platform developers adding free-text input fields to any CSPS page
// WHAT: Standard text input with mandatory voice option + file upload — Q1 Governor directive S060
// PREVENTS: Text-only inputs that exclude voice-first and document-sharing workflows
// RISK: Voice API availability varies by browser — graceful fallback to text-only if not supported
// SCOPE: Platform-wide standard. Every free-text field MUST use this component (or declare why not).
// @csps-id csps.libs.ui.voice-file-input
// DO NOT REPLACE without explicit Governor directive "REPLACE VoiceFileInput".

'use client';

import React, { useState, useRef, useCallback } from 'react';

export interface VoiceFileInputProps {
  /** The input field label */
  label: string;
  /** Placeholder text shown in the textarea */
  placeholder?: string;
  /** Current value */
  value: string;
  /** Change handler — receives the new text value */
  onChange: (value: string) => void;
  /** Optional: files already attached */
  files?: File[];
  /** Optional: file change handler */
  onFilesChange?: (files: File[]) => void;
  /** Whether to show the voice button (default: true) */
  showVoice?: boolean;
  /** Whether to show the file upload button (default: true) */
  showFileUpload?: boolean;
  /** Accepted file types (default: image/*, .pdf, .txt, .doc, .docx) */
  acceptedFileTypes?: string;
  /** Number of textarea rows (default: 4) */
  rows?: number;
  /** Whether the field is required */
  required?: boolean;
  /** Additional tip text shown below the input */
  tip?: string;
  /** Voice profile for tone (future: shapes how AI processes the voice input) */
  voiceProfile?: 'colleague' | 'professional' | 'mentor';
  /** A/B test variant (future: connects to AB-TESTING-MOAT) */
  abVariant?: string;
}

/**
 * Platform-standard text input with voice option + file upload.
 * Governor Q1 S060: mandatory on ALL free-text fields.
 *
 * Usage:
 * ```tsx
 * <VoiceFileInput
 *   label="What do you want to build?"
 *   placeholder="Describe your idea..."
 *   value={text}
 *   onChange={setText}
 * />
 * ```
 */
export function VoiceFileInput({
  label,
  placeholder = 'Type or use voice...',
  value,
  onChange,
  files = [],
  onFilesChange,
  showVoice = true,
  showFileUpload = true,
  acceptedFileTypes = 'image/*,.pdf,.txt,.doc,.docx,.csv,.yaml,.json',
  rows = 4,
  required = false,
  tip,
  voiceProfile = 'colleague',
}: VoiceFileInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // ── Voice recording ───────────────────────────────────────────────────────
  const startVoice = useCallback(() => {
    setVoiceError(null);
    const SpeechRecognition = (window as typeof window & { SpeechRecognition?: typeof globalThis.SpeechRecognition; webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).SpeechRecognition
      || (window as typeof window & { webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Voice not supported in this browser. Type instead.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      onChange(value + (value ? ' ' : '') + transcript);
    };

    recognition.onerror = () => {
      setVoiceError('Voice recording stopped. Your text was saved.');
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [value, onChange]);

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  // ── File upload ───────────────────────────────────────────────────────────
  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles || !onFilesChange) return;
    const combined = [...files, ...Array.from(newFiles)];
    onFilesChange(combined);
  }, [files, onFilesChange]);

  const removeFile = useCallback((idx: number) => {
    if (!onFilesChange) return;
    onFilesChange(files.filter((_, i) => i !== idx));
  }, [files, onFilesChange]);

  // ── Styles ────────────────────────────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#111',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const inputWrapStyle: React.CSSProperties = {
    position: 'relative',
    border: isDragOver ? '1.5px dashed #6366f1' : isRecording ? '1.5px solid #ef4444' : '1px solid #d1d5db',
    borderRadius: 6,
    background: isRecording ? '#fff8f8' : isDragOver ? '#f5f3ff' : '#fff',
    transition: 'border-color 0.15s, background 0.15s',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    paddingRight: (showVoice || showFileUpload) ? 90 : 12,
    border: 'none',
    background: 'transparent',
    borderRadius: 6,
    fontSize: 14,
    lineHeight: 1.5,
    resize: 'vertical',
    outline: 'none',
    color: '#111',
    fontFamily: 'inherit',
  };

  const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    top: 8,
    right: 8,
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  };

  const btnStyle = (active?: boolean, danger?: boolean): React.CSSProperties => ({
    width: 30,
    height: 30,
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    background: danger ? '#fee2e2' : active ? '#6366f1' : '#f3f4f6',
    color: danger ? '#dc2626' : active ? '#fff' : '#6b7280',
    transition: 'background 0.1s, color 0.1s',
    flexShrink: 0,
  });

  return (
    <div style={containerStyle}>
      {/* Label */}
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#dc2626' }}>*</span>}
        {isRecording && (
          <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, animation: 'pulse 1s infinite' }}>
            ● REC
          </span>
        )}
      </label>

      {/* Input area */}
      <div
        style={inputWrapStyle}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <textarea
          style={textareaStyle}
          rows={rows}
          value={value}
          placeholder={isDragOver ? 'Drop files here...' : placeholder}
          onChange={e => onChange(e.target.value)}
          required={required}
        />

        {/* Voice + File controls */}
        <div style={controlsStyle}>
          {showVoice && (
            <button
              type="button"
              style={btnStyle(isRecording, isRecording)}
              onClick={isRecording ? stopVoice : startVoice}
              title={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? '⏹' : '🎙'}
            </button>
          )}
          {showFileUpload && onFilesChange && (
            <button
              type="button"
              style={btnStyle(false)}
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              📎
            </button>
          )}
        </div>

        {/* Hidden file input */}
        {showFileUpload && onFilesChange && (
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes}
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
        )}
      </div>

      {/* Voice error */}
      {voiceError && (
        <p style={{ fontSize: 11, color: '#d97706', margin: 0 }}>⚠ {voiceError}</p>
      )}

      {/* Attached files */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, background: '#f3f4f6', borderRadius: 4, padding: '3px 8px' }}>
              <span>📄 {f.name}</span>
              <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 12, padding: 0 }}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Drag hint */}
      {showFileUpload && onFilesChange && files.length === 0 && !isDragOver && (
        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
          Drag & drop files or click 📎 to attach
        </p>
      )}

      {/* Optional tip */}
      {tip && <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>💡 {tip}</p>}
    </div>
  );
}

export default VoiceFileInput;
