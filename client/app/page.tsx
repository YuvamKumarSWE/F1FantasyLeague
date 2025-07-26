import Link from 'next/link';
import TeamCard from '../components/TeamCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-8 lg:px-12">
          <nav className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              F1<span className="text-red-500">FANTASY</span>
            </div>

            
            <Link href="/login">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-sm font-semibold transition-colors">
              Login
            </button>
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="px-6 lg:px-12 mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-block">
                    <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold tracking-wider uppercase">
                      2025 Season
                    </span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                    RACE TO
                    <span className="block text-red-500">VICTORY</span>
                  </h1>
                  <p className="text-xl text-gray-300 max-w-lg">
                    Build your ultimate F1 fantasy team. Pick drivers, strategize pit stops,
                    and compete against friends in the most thrilling motorsport fantasy league.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold transition-colors flex items-center justify-center group">
                    CREATE TEAM
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-700">
                  <div>
                    <div className="text-3xl font-bold text-red-500">24</div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">Races</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-500">20</div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">Drivers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-500">10</div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">Teams</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Team Card Component */}
              <TeamCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
