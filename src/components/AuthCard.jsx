import { useEffect, useState } from 'react';

export default function AuthCard({ mode, onSwitchMode, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    tenantName: '',
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, password: '' }));
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, mode);
  };

  const title = mode === 'login' ? 'Welcome back' : 'Create your tenant';
  const cta = mode === 'login' ? 'Log in' : 'Register & create tenant';

  return (
    <div className="card max-w-xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-amber-300 font-semibold">Xeno Commerce</p>
          <h1 className="text-2xl font-semibold text-slate-50 mt-1">{title}</h1>
          <p className="text-sm text-slate-400">
            {mode === 'login'
              ? 'Use the account you registered to pull metrics.'
              : 'We will create a tenant, user, and JWT for you.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitchMode}
          className="btn btn-secondary"
          disabled={loading}
        >
          {mode === 'login' ? 'Need an account?' : 'Have an account?'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === 'register' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tenant name</label>
              <input
                className="input"
                name="tenantName"
                placeholder="Acme Inc"
                value={form.tenantName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Your name</label>
              <input
                className="input"
                name="name"
                placeholder="Aanya"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose-400 bg-rose-900/30 border border-rose-800 rounded-xl p-3">{error}</p>}

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Working...' : cta}
        </button>
      </form>

      <div className="mt-4 text-xs text-slate-500">
        Registering calls <code className="text-amber-200">/api/auth/register</code> which creates the tenant and admin user, then returns a JWT. Login calls <code className="text-amber-200">/api/auth/login</code>.
      </div>
    </div>
  );
}
