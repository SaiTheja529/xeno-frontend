import { useState } from 'react';

export default function ShopifyPanel({ onConnect, onSync, busy, status }) {
  const [shopDomain, setShopDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const handleConnect = (e) => {
    e.preventDefault();
    onConnect({ shopDomain, accessToken });
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-title">Shopify sync</p>
        <span className="badge">/api/shopify/connect & /sync</span>
      </div>
      <p className="text-sm text-slate-400">
        Paste the store domain (e.g. <span className="text-amber-200">demo-shop.myshopify.com</span>) and a private app token. Connect stores it for the tenant, Sync pulls customers/products/orders.
      </p>

      <form onSubmit={handleConnect} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-1">
          <label className="label">Shop domain</label>
          <input
            className="input"
            placeholder="my-brand.myshopify.com"
            value={shopDomain}
            onChange={(e) => setShopDomain(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Access token</label>
          <input
            className="input"
            placeholder="shpat_..."
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            required
          />
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="btn btn-secondary w-full" disabled={busy}>
            {busy ? 'Saving…' : 'Connect store'}
          </button>
          <button type="button" className="btn btn-primary w-full" onClick={onSync} disabled={busy}>
            {busy ? 'Syncing…' : 'Sync now'}
          </button>
        </div>
      </form>

      {status && <p className="text-sm text-amber-200">{status}</p>}
    </div>
  );
}
