import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-red-900 relative overflow-hidden">
      {/* Background Pattern - Simplified */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-white text-2xl font-bold">F1</span>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
            F1 Fantasy
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              League
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            Build your ultimate Formula 1 team and compete with friends
          </p>
          
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            Choose drivers, select constructors, and earn points based on real F1 race results
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🏎️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Pick Your Team</h3>
            <p className="text-gray-300 text-sm">Select drivers and constructors within budget constraints</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Scoring</h3>
            <p className="text-gray-300 text-sm">Earn points based on actual race performance and results</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Compete & Win</h3>
            <p className="text-gray-300 text-sm">Climb the leaderboard and prove you're the ultimate F1 strategist</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Join the Championship
          </h2>
          
          <div className="space-y-4">
            <Link
              to="/signup"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 block text-center font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Racing
            </Link>
            
            <Link
              to="/login"
              className="w-full bg-white bg-opacity-20 backdrop-blur-sm text-white py-4 px-6 rounded-xl hover:bg-opacity-30 transition-all duration-300 block text-center font-semibold text-lg border border-white border-opacity-30 hover:border-opacity-50"
            >
              Already Racing? Login
            </Link>
          </div>
          
          <p className="text-gray-400 text-sm text-center mt-6">
            Free to play • No credit card required
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center space-x-8 mt-12 text-gray-400">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">21</div>
            <div className="text-sm">Drivers</div>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">10</div>
            <div className="text-sm">Teams</div>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">24</div>
            <div className="text-sm">Races</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-red-500 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-blue-500 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-yellow-500 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-5 h-5 bg-green-500 rounded-full opacity-30 animate-pulse"></div>
    </div>
  );
}

export default Landing;
