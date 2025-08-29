import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      {/* Top Nav */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center">
              <span className="font-bold font-f1">F1</span>
            </div>
            <span className="font-f1 text-xl tracking-wide">Fantasy League</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/signup" className="btn-f1-primary">Join the Grid</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-md">
          {/* Background Effects */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-[#FF1801]/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-10 h-96 w-96 rounded-full bg-red-500/5 blur-3xl" />
          </div>

          <div className="relative">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black mb-4">Welcome Back</h1>
              <p className="text-gray-300">Sign in to access your pit wall</p>
            </div>

            {/* Login Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
              {error && (
                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-xs text-red-400">!</span>
                    </div>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF1801] focus:outline-none focus:ring-1 focus:ring-[#FF1801] transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-[#FF1801] focus:outline-none focus:ring-1 focus:ring-[#FF1801] transition-colors"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5 text-[#FF1801] focus:ring-[#FF1801]" />
                    <span className="text-sm text-gray-300">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-[#FF1801] hover:text-red-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-[#FF1801] to-red-600 py-3 font-semibold text-white hover:from-red-600 hover:to-[#FF1801] focus:outline-none focus:ring-2 focus:ring-[#FF1801] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                New to the grid?{' '}
                <Link to="/signup" className="text-[#FF1801] hover:text-red-400 font-semibold transition-colors">
                  Create your account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 mt-16">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center text-sm font-bold">F1</div>
            <span className="font-f1">Fantasy League</span>
          </div>
          <p className="text-xs text-gray-400">© 2025 F1 Fantasy League. Built for race fans.</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
