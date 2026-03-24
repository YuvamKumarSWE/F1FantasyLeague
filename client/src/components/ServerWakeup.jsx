import { useState, useEffect, useCallback } from 'react';

const DURATION = 120;
const SESSION_KEY = 'f1_wakeup_seen';

export default function ServerWakeup() {
  // null = still checking, true = show timer, false = hidden
  const [visible, setVisible] = useState(null);
  const [seconds, setSeconds] = useState(DURATION);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, 500);
  }, []);

  useEffect(() => {
    // Already seen this session — never show
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch(`${import.meta.env.VITE_API_URL}/health`, { signal: controller.signal })
      .then((res) => {
        clearTimeout(timeout);
        if (res.ok) {
          // Server is up — skip the timer entirely
          sessionStorage.setItem(SESSION_KEY, '1');
          setVisible(false);
        } else {
          setVisible(true);
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        // Server unreachable or timed out — show the timer
        setVisible(true);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (seconds <= 0) {
      dismiss();
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [visible, seconds, dismiss]);

  if (visible === null || visible === false) return null;

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const progress = ((DURATION - seconds) / DURATION) * 100;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.97)',
        backdropFilter: 'blur(20px)',
        transition: 'opacity 0.5s ease',
        opacity: exiting ? 0 : 1,
      }}
    >
      {/* Speed lines */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: `${10 + i * 12}%`, left: '-10%', width: '120%', height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(225,6,0,${0.03 + i * 0.01}), transparent)`,
            transform: `rotate(-${1 + i * 0.3}deg)`,
          }} />
        ))}
      </div>

      {/* Corner glows */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '200px', background: 'radial-gradient(circle at 0 0, rgba(225,6,0,0.15), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle at 100% 100%, rgba(225,6,0,0.1), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px',
        padding: '48px 32px', maxWidth: '480px', width: '100%',
        animation: 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', background: '#E10600', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '18px', color: '#fff',
          }}>F1</div>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '22px',
            letterSpacing: '0.08em', color: '#f5f5f5', textTransform: 'uppercase',
          }}>Fantasy League</span>
        </div>

        {/* Circular timer */}
        <div style={{ position: 'relative', width: '128px', height: '128px' }}>
          <svg width="128" height="128" style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
            <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle
              cx="64" cy="64" r="54" fill="none" stroke="#E10600" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '32px',
              color: '#f5f5f5', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
            }}>{mins}:{secs}</span>
            <span style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>remaining</span>
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '26px',
            letterSpacing: '0.04em', textTransform: 'uppercase', color: '#f5f5f5',
            marginBottom: '10px', lineHeight: 1.1,
          }}>Server is spinning up</h2>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, maxWidth: '340px' }}>
            Running on a free-tier server — it goes to sleep between sessions.
            Hang tight for ~2 minutes and everything will be fully live.
          </p>
        </div>

        {/* Portfolio link */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            In the meantime
          </span>
          <a
            href="https://yuvam.vercel.app/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', background: 'rgba(225,6,0,0.1)',
              border: '1px solid rgba(225,6,0,0.3)', borderRadius: '8px',
              color: '#f5f5f5', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              fontSize: '15px', letterSpacing: '0.08em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(225,6,0,0.2)'; e.currentTarget.style.borderColor = 'rgba(225,6,0,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(225,6,0,0.1)'; e.currentTarget.style.borderColor = 'rgba(225,6,0,0.3)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Check out my portfolio
          </a>
        </div>

        {/* Skip */}
        {seconds < 115 && (
          <button
            onClick={dismiss}
            style={{
              background: 'none', border: 'none', color: '#333', fontSize: '12px',
              cursor: 'pointer', textDecoration: 'underline', padding: '4px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#666')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#333')}
          >
            skip
          </button>
        )}
      </div>
    </div>
  );
}
