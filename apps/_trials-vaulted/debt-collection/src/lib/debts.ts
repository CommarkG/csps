// apps/debt-collection/src/lib/debts.ts
// PROTO-K-A data layer — YAML-backed debt store.
// Phase 1: file-based (no Supabase). Phase 2 will migrate to db.
// All functions are server-side only (Node fs).

import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

export type DebtStatus = 'pending' | 'message_sent' | 'paid'
export type Currency = 'ILS' | 'USD' | 'EUR'

export type Debt = {
  id: string
  debtor_name: string
  amount: number
  currency: Currency
  description: string
  due_date: string       // ISO date string YYYY-MM-DD
  status: DebtStatus
  created_at: string     // ISO date string
  messages_sent: number
}

type DebtsFile = { debts: Debt[] }

const DEBTS_PATH = path.join(process.cwd(), '.csps', 'debts.yaml')

export function readDebts(): Debt[] {
  if (!fs.existsSync(DEBTS_PATH)) return []
  const raw = fs.readFileSync(DEBTS_PATH, 'utf8')
  const parsed = yaml.load(raw) as DebtsFile
  return parsed?.debts ?? []
}

export function writeDebts(debts: Debt[]): void {
  const content = yaml.dump({ debts }, { lineWidth: 120, quotingType: '"' })
  fs.writeFileSync(DEBTS_PATH, content, 'utf8')
}

export function createDebt(input: Omit<Debt, 'id' | 'status' | 'created_at' | 'messages_sent'>): Debt {
  const debts = readDebts()
  const newDebt: Debt = {
    ...input,
    id: `debt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: 'pending',
    created_at: new Date().toISOString().slice(0, 10),
    messages_sent: 0,
  }
  writeDebts([...debts, newDebt])
  return newDebt
}

export function updateDebt(id: string, updates: Partial<Omit<Debt, 'id'>>): Debt | null {
  const debts = readDebts()
  const idx = debts.findIndex(d => d.id === id)
  if (idx === -1) return null
  const updated = { ...debts[idx], ...updates }
  debts[idx] = updated
  writeDebts(debts)
  return updated
}

export function getDebt(id: string): Debt | null {
  return readDebts().find(d => d.id === id) ?? null
}

// Summary helpers
export function totalOutstanding(debts: Debt[]): { byDebt: { id: string; amount: number; currency: Currency }[] } {
  return {
    byDebt: debts
      .filter(d => d.status !== 'paid')
      .map(d => ({ id: d.id, amount: d.amount, currency: d.currency })),
  }
}
