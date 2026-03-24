import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Drivers', path: '/drivers' },
  { name: 'Constructors', path: '/constructors' },
  { name: 'Fantasy Team', path: '/fantasy-team' },
  { name: 'Races', path: '/races' },
  { name: 'Standings', path: '/standings' },
  { name: 'Leaderboard', path: '/leaderboard' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,10,0.95)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(16px)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '34px', height: '34px', background: '#E10600', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '14px', color: '#fff',
              flexShrink: 0,
            }}>F1</div>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '17px',
              letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5f5f5',
            }}>Fantasy League</span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center', padding: '0 24px' }} className="hidden lg:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                    transition: 'color 0.15s, background 0.15s',
                    color: active ? '#f5f5f5' : '#666',
                    background: active ? 'rgba(225,6,0,0.12)' : 'transparent',
                    borderBottom: active ? '2px solid #E10600' : '2px solid transparent',
                    borderRadius: '6px 6px 0 0',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden lg:flex">
            <span style={{ fontSize: '13px', color: '#555' }}>
              {user?.username || user?.email || 'Driver'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '7px 16px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px',
                color: '#888', fontSize: '12px', fontWeight: 600,
                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f5f5f5'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', color: '#888',
            }}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? '600px' : '0',
          transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
          borderTop: open ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          background: '#0d0d0d',
        }}
        className="lg:hidden"
      >
        <div style={{ padding: '12px 16px 20px' }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', padding: '11px 16px', marginBottom: '2px',
                  borderRadius: '8px', textDecoration: 'none', fontSize: '15px',
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  color: active ? '#f5f5f5' : '#555',
                  background: active ? 'rgba(225,6,0,0.1)' : 'transparent',
                  borderLeft: active ? '3px solid #E10600' : '3px solid transparent',
                  transition: 'color 0.15s, background 0.15s',
                }}
              >
                {item.name}
              </Link>
            );
          })}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#444' }}>{user?.username || user?.email}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                color: '#666', fontSize: '12px', fontWeight: 600,
                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
