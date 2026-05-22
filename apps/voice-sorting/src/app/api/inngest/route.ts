// APP-001 E1 stub — Inngest jobs deferred to E2
import { NextResponse } from 'next/server'
export function GET() { return NextResponse.json({ status: 'E2' }) }
export function POST() { return NextResponse.json({ status: 'E2' }) }
