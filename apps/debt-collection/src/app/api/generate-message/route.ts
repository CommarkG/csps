// Debt Collection — POST /api/generate-message
// Generates a professional, colleague-tone debt reminder using Claude Haiku.
// PROTO-K-A Phase 1 | Session S060

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { debtor_name, amount, currency, description, due_date } = body as Record<string, unknown>

  if (!debtor_name || !amount || !description) {
    return NextResponse.json({ error: 'debtor_name, amount, and description are required' }, { status: 400 })
  }

  const currencySymbols: Record<string, string> = { ILS: '₪', USD: '$', EUR: '€' }
  const sym = currencySymbols[String(currency)] ?? String(currency)
  const formattedAmount = `${sym}${Number(amount).toLocaleString('en-US')}`

  const prompt = `Write a professional, warm message from a small business owner to a client who owes ${formattedAmount} for ${description}. The message should be direct but not confrontational — like a colleague would ask. Max 3 short paragraphs. Debtor: ${debtor_name}. Due: ${due_date ?? 'already past due'}.

Write only the message itself. No subject line. No "Dear..." prefix unless it feels natural. Start directly with the situation.`

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    })

    const message = response.content[0]?.type === 'text' ? response.content[0].text : null
    if (!message) return NextResponse.json({ error: 'No message generated' }, { status: 500 })

    return NextResponse.json({ message })
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
