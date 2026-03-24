import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: '#161616', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', color: '#f5f5f5', fontSize: '14px',
  outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(16px)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/landing" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '34px', height: '34px', background: '#E10600', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '14px', color: '#fff' }}>F1</div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '17px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5f5f5' }}>Fantasy League</span>
          </Link>
          <Link to="/signup" className="btn-f1-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>Join the Grid</Link>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: '400px', animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '36px', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '6px' }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '14px', color: '#555' }}>Sign in to access your pit wall</p>
          </div>

          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '28px' }}>
            {error && (
              <div style={{ marginBottom: '20px', padding: '12px 14px', background: 'rgba(225,6,0,0.08)', border: '1px solid rgba(225,6,0,0.2)', borderRadius: '8px', fontSize: '13px', color: '#ff6b6b' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#E10600'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange} required
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#E10600'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-f1-primary"
                style={{ width: '100%', marginTop: '4px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#444' }}>
            New to the grid?{' '}
            <Link to="/signup" style={{ color: '#E10600', textDecoration: 'none', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
