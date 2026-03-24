import { Link } from 'react-router-dom';

const stats = [
  { value: '23', label: 'Drivers' },
  { value: '10', label: 'Constructors' },
  { value: '24', label: 'Races' },
];

const steps = [
  {
    n: '01',
    title: 'Draft your lineup',
    desc: 'Pick 5 drivers and 1 constructor within budget. Balance star power with underdog value.',
  },
  {
    n: '02',
    title: 'Set race tactics',
    desc: 'Choose your captain, lock your roster before qualifying, and adapt to form.',
  },
  {
    n: '03',
    title: 'Climb the ranks',
    desc: 'Points from quali, race results, fastest laps, and constructor bonuses.',
  },
];

const mockDrivers = [
  { name: 'Verstappen', team: 'Red Bull', pts: '+18', pos: 1 },
  { name: 'Norris', team: 'McLaren', pts: '+15', pos: 2 },
  { name: 'Leclerc', team: 'Ferrari', pts: '+12', pos: 3 },
  { name: 'Hamilton', team: 'Ferrari', pts: '+10', pos: 4 },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f5' }}>

      {/* ── Nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', background: '#E10600', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '15px', color: '#fff',
            }}>F1</div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '18px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Fantasy League
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/login" style={{
              padding: '8px 18px', color: '#a0a0a0', fontSize: '13px', fontWeight: 500,
              borderRadius: '6px', textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.color = '#a0a0a0'}
            >
              Sign in
            </Link>
            <Link to="/signup" className="btn-f1-primary" style={{ padding: '9px 20px', fontSize: '13px' }}>
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 64px' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-80px', right: '-40px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(225,6,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(225,6,0,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '48px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
          {/* Left */}
          <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '5px 12px', borderRadius: '999px',
              border: '1px solid rgba(225,6,0,0.3)', background: 'rgba(225,6,0,0.07)',
              marginBottom: '24px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E10600', animation: 'pulseRing 2s ease infinite' }} />
              <span style={{ fontSize: '12px', color: '#ccc', letterSpacing: '0.08em', textTransform: 'uppercase' }}>2026 Season Live</span>
            </div>

            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900, fontSize: 'clamp(48px, 7vw, 80px)',
              lineHeight: 0.95, letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Build.<br />
              Race.<br />
              <span style={{ color: '#E10600' }}>Dominate.</span>
            </h1>

            <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.65, maxWidth: '420px', marginBottom: '32px' }}>
              Draft your dream team with real F1 performance data. Watch points update live across every grand prix.
              Strategy wins championships.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn-f1-primary">Create your team</Link>
              <Link to="/login" className="btn-f1-secondary">Sign in</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '40px' }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '36px', color: '#E10600', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — preview card */}
          <div style={{ animation: 'slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
            <div style={{
              background: '#111', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              {/* Card header */}
              <div style={{
                padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live points engine</span>
                <span style={{
                  padding: '3px 10px', borderRadius: '999px',
                  background: 'rgba(225,6,0,0.12)', border: '1px solid rgba(225,6,0,0.25)',
                  fontSize: '11px', color: '#E10600', textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>Race</span>
              </div>

              {/* Driver rows */}
              <div style={{ padding: '8px' }}>
                {mockDrivers.map((d) => (
                  <div key={d.name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '6px',
                        background: d.pos === 1 ? 'rgba(225,6,0,0.15)' : 'rgba(255,255,255,0.05)',
                        border: d.pos === 1 ? '1px solid rgba(225,6,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', color: d.pos === 1 ? '#E10600' : '#666',
                        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                      }}>P{d.pos}</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#f5f5f5' }}>{d.name}</div>
                        <div style={{ fontSize: '11px', color: '#555' }}>{d.team}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '16px', color: '#22c55e' }}>{d.pts}</div>
                  </div>
                ))}
              </div>

              {/* Bonus row */}
              <div style={{
                margin: '8px', marginTop: '4px', padding: '10px 12px',
                borderRadius: '8px', background: 'rgba(255,255,255,0.02)',
                display: 'flex', gap: '8px',
              }}>
                {['Fastest Lap +5', 'Positions +2', 'Constructor +3'].map((b) => (
                  <div key={b} style={{
                    flex: 1, textAlign: 'center', padding: '6px 4px',
                    borderRadius: '6px', background: 'rgba(255,255,255,0.03)',
                    fontSize: '10px', color: '#555', letterSpacing: '0.04em',
                  }}>{b}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Red divider ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, #E10600, transparent)' }} />
      </div>

      {/* ── How it works ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', color: '#E10600', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>How it works</p>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(32px, 4vw, 48px)', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
            Win with strategy
          </h2>
        </div>

        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {steps.map((s) => (
            <div key={s.n} style={{
              position: 'relative', padding: '28px 24px',
              background: '#111', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px', overflow: 'hidden',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(225,6,0,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ position: 'absolute', top: '16px', right: '20px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '48px', color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>{s.n}</div>
              <div style={{
                display: 'inline-block', padding: '4px 10px', marginBottom: '16px',
                background: 'rgba(225,6,0,0.1)', border: '1px solid rgba(225,6,0,0.2)',
                borderRadius: '4px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: '13px', color: '#E10600', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>{s.n}</div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: '48px 40px', borderRadius: '12px',
          background: '#111', border: '1px solid rgba(225,6,0,0.2)',
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(225,6,0,0.12), transparent 70%)', pointerEvents: 'none' }} />
          {/* Red left edge */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#E10600', borderRadius: '12px 0 0 12px' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(24px, 3vw, 36px)', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '6px' }}>
                Your pit wall awaits
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Join the grid before the next lights out.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn-f1-primary">Get started</Link>
              <Link to="/login" className="btn-f1-secondary">Sign in</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#080808' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', background: '#E10600', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '12px', color: '#fff' }}>F1</div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555' }}>Fantasy League</span>
          </div>
          <p style={{ fontSize: '12px', color: '#444' }}>© {new Date().getFullYear()} F1 Fantasy League. Built for race fans.</p>
        </div>
      </footer>
    </div>
  );
}
