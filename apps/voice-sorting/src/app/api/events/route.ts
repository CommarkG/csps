// APP-001 E1 stub — SSE events deferred to E2
export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(JSON.stringify({ status: 'E2' }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
