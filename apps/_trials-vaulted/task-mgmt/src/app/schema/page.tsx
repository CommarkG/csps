import { PILLARS } from './_data/pillars';
import { ThresholdDiagram } from './_components/ThresholdDiagram';
import { PillarBlock } from './_components/PillarBlock';

export const metadata = {
  title: 'CSPS Schema — Platform Documentation',
  description: 'The complete CSPS platform architecture: 7 pillars, audit questions, and routing.',
};

export default function SchemaPage() {
  const complete = PILLARS.filter((p) => p.status === 'complete').length;
  const inProgress = PILLARS.filter((p) => p.status === 'in-progress').length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">CSPS Platform Schema</h1>
          <p className="text-slate-600 max-w-2xl">
            The complete architecture of the CoreSights Platform Services. Every pillar answers
            specific audit questions. Everything connects through The Threshold.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="text-green-700 font-medium">✅ {complete} complete</span>
            <span className="text-amber-700 font-medium">⏳ {inProgress} in progress</span>
            <span className="text-slate-500">7 pillars total</span>
          </div>
        </div>

        <ThresholdDiagram />

        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Platform Pillars</h2>
          <div className="space-y-3">
            {PILLARS.map((pillar) => (
              <PillarBlock key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center pb-4">
          CSPS Platform Documentation · Auto-generated from pillar definitions ·{' '}
          <a href="https://github.com/CommarkG/csps" className="hover:underline">
            github.com/CommarkG/csps
          </a>
        </p>
      </div>
    </main>
  );
}
