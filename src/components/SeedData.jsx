export default function SeedData({ onSeed, busy, status }) {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="section-title">Sample data</p>
        <span className="badge">GET /api/dev/seed-sample-data</span>
      </div>
      <p className="text-sm text-slate-400">
        Use this while developing without Shopify. Creates demo customers, products, and orders for the authenticated tenant.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="btn btn-primary sm:w-auto" onClick={onSeed} disabled={busy}>
          {busy ? 'Seeding…' : 'Seed data'}
        </button>
        {status && <span className="text-sm text-amber-200">{status}</span>}
      </div>
    </div>
  );
}
