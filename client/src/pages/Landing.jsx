import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      {/* Top Nav */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FF1801] to-red-600 grid place-items-center">
              <span className="font-bold font-f1">F1</span>
            </div>
            <span className="font-f1 text-xl tracking-wide">Fantasy League</span>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10">Sign In</Link>
            <Link to="/signup" className="btn-f1-primary">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-[#FF1801]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-10 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 30%,#FF1801 0,transparent 35%), radial-gradient(circle at 80% 70%,#ffffff 0,transparent 35%)'}} />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-14 lg:pt-24 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                <span className="inline-block h-2 w-2 rounded-full bg-[#FF1801]" /> Live race data scoring
              </p>
              <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight">
                Build. Race. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1801] to-orange-400">Dominate.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 max-w-xl">
                Draft your dream team with real F1 performance and watch points update across the season. Strategy wins championships.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="btn-f1-primary px-6 py-3 text-center">Create your team</Link>
                <Link to="/login" className="btn-f1-secondary px-6 py-3 text-center">I already have an account</Link>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <div className="text-3xl font-extrabold text-[#FF1801]">20+</div>
                  <div className="text-xs text-gray-400">Drivers</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#FF1801]">10</div>
                  <div className="text-xs text-gray-400">Constructors</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#FF1801]">24</div>
                  <div className="text-xs text-gray-400">Races</div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF1801]/40 via-white/10 to-transparent blur opacity-60" />
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-gray-300">Live points engine</div>
                  <span className="rounded-full bg-[#FF1801]/20 px-3 py-1 text-xs text-[#FF1801]">Quali</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Max Verstappen', team: 'Red Bull', delta: '+18' },
                    { name: 'Lando Norris', team: 'McLaren', delta: '+12' },
                    { name: 'Charles Leclerc', team: 'Ferrari', delta: '+10' },
                    { name: 'Lewis Hamilton', team: 'Mercedes', delta: '+8' },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-white/10 to-white/5 grid place-items-center text-xs text-gray-300">{i + 1}</div>
                        <div>
                          <div className="font-semibold">{d.name}</div>
                          <div className="text-xs text-gray-400">{d.team}</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-emerald-400">{d.delta}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-300">
                  <div className="rounded-md bg-white/5 p-2">Fastest Lap +5</div>
                  <div className="rounded-md bg-white/5 p-2">Positions Gained +2</div>
                  <div className="rounded-md bg-white/5 p-2">Constructor Bonus +3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8">Win with strategy</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Draft your lineup', desc: 'Pick 5 drivers and 1 constructor within the budget. Balance stars with value picks.' },
            { title: 'Set race tactics', desc: 'Choose your captain, lock your team before quali, and react to form swings.' },
            { title: 'Climb the ranks', desc: 'Score from quali and race results. Chase podiums, fastest laps, and team bonuses.' },
          ].map((s, i) => (
            <div key={i} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.06]">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF1801] to-red-600 font-bold">{i + 1}</div>
              <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
              <p className="text-gray-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-3xl font-extrabold">Global leaderboard</h2>
          <Link to="/leaderboard" className="text-sm text-gray-300 hover:text-white">View all →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white/10 grid place-items-center text-sm">#{i}</div>
                  <div>
                    <div className="font-semibold">Team {i}</div>
                    <div className="text-xs text-gray-400">Manager {i}</div>
                  </div>
                </div>
                <div className="text-[#FF1801] font-bold">{2400 - i * 7} pts</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.06] to-transparent px-6 py-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF1801]/20 blur-2xl" />
          <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Your pit wall awaits</h3>
              <p className="text-gray-300">Sign up now and join the grid before the next lights out.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/signup" className="btn-f1-primary px-6 py-3">Get started</Link>
              <Link to="/login" className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/10">Sign in</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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

export default Landing;
