import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIChatbot from './AIChatbot';

const Layout = ({ children, title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f5' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{
                width: '32px', height: '32px', background: '#E10600', borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '13px', color: '#fff',
              }}>F1</div>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '16px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5f5f5' }}>
                Fantasy League
              </span>
            </Link>
            {title && (
              <>
                <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)' }} />
                <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>{title}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/dashboard"
              style={{
                padding: '7px 14px', borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none',
                color: '#666', fontSize: '12px', fontWeight: 600,
                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em',
                textTransform: 'uppercase', transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              ← Dashboard
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '7px 14px', borderRadius: '6px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                color: '#555', fontSize: '12px', fontWeight: 600,
                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em',
                textTransform: 'uppercase', transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', position: 'relative' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '64px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#080808' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '26px', height: '26px', background: '#E10600', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '11px', color: '#fff' }}>F1</div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444' }}>Fantasy League</span>
          </div>
          <p style={{ fontSize: '12px', color: '#333' }}>© {new Date().getFullYear()} F1 Fantasy League</p>
        </div>
      </footer>

      <AIChatbot />
    </div>
  );
};

export default Layout;
