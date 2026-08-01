'use client';

// Reusable shell for admin sections whose UI is ready but data isn't wired up yet.
// Swap the <EmptyState /> body for a real table/list once the backend endpoint exists.
export default function PlaceholderPage({ icon: Icon, title, description, primaryLabel }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">{title}</h1>
          <p className="text-slate-500 text-sm">{description}</p>
        </div>
        {primaryLabel && (
          <button
            className="flex items-center gap-2 text-white font-medium px-4 py-2.5 rounded-lg"
            style={{ backgroundColor: 'var(--pa-primary)' }}
          >
            {primaryLabel}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[var(--pa-border)] p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--pa-primary-light)] flex items-center justify-center mb-4">
          <Icon className="w-8 h-8" style={{ color: 'var(--pa-primary)' }} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">No data connected yet</h2>
        <p className="text-slate-400 text-sm max-w-sm">
          This page&apos;s design is ready — connect it to your {title.toLowerCase()} API endpoint to show live data here.
        </p>
      </div>
    </div>
  );
}
