import { useEffect, useState } from 'react';
import AuthCard from './components/AuthCard';
import SummaryCards from './components/SummaryCards';
import OrdersTable from './components/OrdersTable';
import TopCustomers from './components/TopCustomers';
import ShopifyPanel from './components/ShopifyPanel';
import SeedData from './components/SeedData';
import { api } from './api';

const STORAGE_KEY = 'xeno-session';

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null, tenant: null };
  } catch (error) {
    console.warn('Unable to read session from storage', error);
    return { token: null, user: null, tenant: null };
  }
}

export default function App() {
  const initial = loadSession();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);
  const [tenant, setTenant] = useState(initial.tenant);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [actionBusy, setActionBusy] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const persistSession = (nextToken, nextUser, nextTenant) => {
    setToken(nextToken);
    setUser(nextUser);
    setTenant(nextTenant);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser, tenant: nextTenant })
    );
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    setTenant(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleAuth = async (payload, mode) => {
    try {
      setAuthError('');
      setMessage('');
      setLoading(true);
      const result =
        mode === 'login' ? await api.login(payload) : await api.register(payload);
      persistSession(result.token, result.user, result.tenant);
      setMessage(result.message || 'Authenticated');
      setAuthMode('login');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [summaryRes, ordersRes, customersRes] = await Promise.all([
        api.summary(token),
        api.ordersByDate(token),
        api.topCustomers(token),
      ]);

      setSummary(summaryRes.summary);
      setOrdersByDate(ordersRes.data || []);
      setTopCustomers(customersRes.customers || []);
    } catch (err) {
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      setActionBusy(true);
      setMessage('');
      const res = await api.seedSampleData(token);
      setMessage(res.message);
      await fetchDashboard();
    } catch (err) {
      setError(err.message || 'Seeding failed');
    } finally {
      setActionBusy(false);
    }
  };

  const handleShopifyConnect = async ({ shopDomain, accessToken }) => {
    try {
      setActionBusy(true);
      setMessage('');
      const res = await api.connectShopify(token, { shopDomain, accessToken });
      setMessage(res.message || 'Store saved');
    } catch (err) {
      setError(err.message || 'Could not connect store');
    } finally {
      setActionBusy(false);
    }
  };

  const handleSync = async () => {
    try {
      setActionBusy(true);
      setMessage('');
      const res = await api.syncShopify(token);
      setMessage(res.message || 'Sync complete');
      await fetchDashboard();
    } catch (err) {
      setError(err.message || 'Sync failed');
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-amber-300 tracking-widest font-semibold">
              Xeno Commerce
            </p>
            <h1 className="text-xl font-semibold text-slate-50">Insights + Shopify sync</h1>
            <p className="text-sm text-slate-400">
              React + Vite + Tailwind frontend wired to your existing Express + Prisma API.
            </p>
          </div>
          {token && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-200 font-semibold">{user?.name || user?.email}</p>
                <p className="text-xs text-slate-500">{tenant?.name}</p>
              </div>
              <button className="btn btn-secondary" onClick={clearSession}>
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {!token ? (
          <AuthCard
            mode={authMode}
            onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            onSubmit={handleAuth}
            loading={loading}
            error={authError}
          />
        ) : (
          <>
            <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-amber-200">Tenant: {tenant?.name}</p>
                <h2 className="text-2xl font-semibold text-slate-50">Live metrics</h2>
                <p className="text-sm text-slate-400">JWT is sent as Bearer to all protected routes.</p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary" onClick={fetchDashboard} disabled={loading}>
                  {loading ? 'Refreshing…' : 'Refresh data'}
                </button>
                <a
                  className="btn btn-primary"
                  href="http://localhost:4000/api/health"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ping API
                </a>
              </div>
            </div>

            {message && <div className="card p-4 border border-emerald-700 text-emerald-200">{message}</div>}
            {error && <div className="card p-4 border border-rose-700 text-rose-200">{error}</div>}

            <SummaryCards summary={summary} loading={loading} />

            <div className="grid gap-4 md:grid-cols-2">
              <SeedData onSeed={handleSeed} busy={actionBusy} status={message} />
              <ShopifyPanel onConnect={handleShopifyConnect} onSync={handleSync} busy={actionBusy} status={message} />
            </div>

            <OrdersTable rows={ordersByDate} />
            <TopCustomers customers={topCustomers} />
          </>
        )}
      </main>
    </div>
  );
}
