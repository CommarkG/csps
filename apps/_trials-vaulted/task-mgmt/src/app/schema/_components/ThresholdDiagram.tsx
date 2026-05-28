import { THRESHOLD_ROUTES } from '../_data/pillars';

export function ThresholdDiagram() {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">The Threshold</h2>
      <p className="text-sm text-slate-600 mb-5">
        Every input — free text, feature request, or directive — enters through The Threshold.
        It classifies intent and routes to the correct domain before any implementation begins.
      </p>

      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="w-full max-w-sm bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Free text input</p>
          <p className="text-sm font-medium text-slate-700 italic">
            &ldquo;I want to work on a landing page element...&rdquo;
          </p>
        </div>
        <div className="text-slate-300 text-xl">↓</div>
        <div className="bg-indigo-600 text-white rounded-lg px-6 py-3 text-center shadow">
          <p className="text-xs uppercase tracking-widest mb-1 opacity-75">Classify intent</p>
          <p className="text-sm font-bold">THE THRESHOLD</p>
        </div>
        <div className="text-slate-300 text-xl">↓</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {THRESHOLD_ROUTES.map((route) => (
          <div
            key={route.domain}
            className="rounded-lg border border-slate-200 bg-white p-3 hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{route.icon}</span>
              <span className="text-sm font-semibold text-slate-800">{route.domain}</span>
            </div>
            <p className="text-xs text-slate-500 italic mb-2">&ldquo;{route.example}&rdquo;</p>
            <p className="text-xs text-indigo-600 font-medium">{route.target}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
