import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PILLARS } from '../_data/pillars';
import { StatusBadge } from '../_components/StatusBadge';
import { AuditChecklist } from '../_components/AuditChecklist';
import { SubCategoryTree } from '../_components/SubCategoryTree';

export async function generateStaticParams() {
  return PILLARS.map((p) => ({ pillarId: p.id }));
}

export async function generateMetadata({ params }: { params: { pillarId: string } }) {
  const pillar = PILLARS.find((p) => p.id === params.pillarId);
  if (!pillar) return {};
  return { title: `${pillar.fullTitle} — CSPS Schema` };
}

export default function PillarPage({ params }: { params: { pillarId: string } }) {
  const pillar = PILLARS.find((p) => p.id === params.pillarId);
  if (!pillar) notFound();

  const connectedPillars = PILLARS.filter((p) => pillar.connections.includes(p.id));
  const answeredCount = pillar.auditQuestions.filter((q) => q.status === 'answered').length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        <nav className="text-sm text-slate-500">
          <Link href="/schema" className="hover:text-slate-900 hover:underline">Schema</Link>
          {' / '}
          <span className="text-slate-900">{pillar.title}</span>
        </nav>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{pillar.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{pillar.fullTitle}</h1>
                <StatusBadge status={pillar.status} />
              </div>
              <p className="text-base text-slate-600 italic mb-3">{pillar.tagline}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{pillar.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Audit Status</h2>
            <span className="text-sm text-slate-500">
              {answeredCount} / {pillar.auditQuestions.length} answered
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
            <div
              className="bg-green-500 rounded-full h-2 transition-all"
              style={{ width: `${(answeredCount / pillar.auditQuestions.length) * 100}%` }}
            />
          </div>
          <AuditChecklist questions={pillar.auditQuestions} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Components</h2>
          <SubCategoryTree categories={pillar.subCategories} />
        </div>

        {connectedPillars.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Connected Pillars</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {connectedPillars.map((conn) => (
                <Link
                  key={conn.id}
                  href={`/schema/${conn.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200
                    hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-2xl">{conn.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700">
                      {conn.fullTitle}
                    </p>
                    <p className="text-xs text-slate-500">{conn.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/schema"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          ← Back to all pillars
        </Link>
      </div>
    </main>
  );
}
