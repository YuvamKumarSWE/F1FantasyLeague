import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Landing() {
  const [currentGradient, setCurrentGradient] = useState(0);
  
  const gradients = [
    'from-slate-900 via-gray-900 to-slate-800',
    'from-gray-900 via-slate-900 to-gray-800',
    'from-slate-800 via-gray-900 to-slate-900'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [gradients.length]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} relative overflow-hidden transition-all duration-[8000ms]`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 circuit-pattern"></div>
      </div>
      
      {/* Minimal floating elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-red-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>

      <div className="relative min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg font-bold font-f1">F1</span>
            </div>
            <span className="text-white text-xl font-bold font-f1">FANTASY LEAGUE</span>
          </div>
          
          {/* CTA in Header */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white px-4 py-2 transition-colors duration-300 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 max-w-7xl mx-auto w-full">
          
          {/* Hero Section */}
          <div className="text-center mb-16 max-w-4xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
              <span className="font-f1">FORMULA 1</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-400">
                Fantasy Racing
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Build your dream F1 team, compete with real race data, and prove your strategic mastery in the world's premier motorsport championship.
            </p>

            {/* Primary CTA */}
            <div className="f1-card max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4 font-f1">
                JOIN THE CHAMPIONSHIP
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Start your journey to becoming the ultimate F1 fantasy champion
              </p>
              
              <div className="space-y-4">
                <Link
                  to="/signup"
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 px-8 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 block text-center font-bold text-lg transform hover:-translate-y-1"
                >
                  START RACING
                </Link>
                
                <Link
                  to="/login"
                  className="w-full glass text-white py-4 px-8 rounded-xl hover:bg-white/10 transition-all duration-300 block text-center font-medium text-lg border border-white/20 hover:border-white/40"
                >
                  Already Racing? Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 w-full max-w-6xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-5a2 2 0 011-1h2a2 2 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-f1">STRATEGIC TEAM BUILDING</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Carefully select drivers and constructors within budget constraints. Every decision impacts your championship standing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-f1">REAL-TIME DATA</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Scoring based on actual Formula 1 race results, qualifying performances, and championship standings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-f1">COMPETITIVE RACING</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Compete against other fantasy managers in global leaderboards and prove your motorsport expertise.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 text-center mb-16">
            <div>
              <div className="text-4xl font-bold text-white mb-2 font-f1">20+</div>
              <div className="text-gray-400 font-medium">Elite Drivers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2 font-f1">10</div>
              <div className="text-gray-400 font-medium">Constructor Teams</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2 font-f1">24</div>
              <div className="text-gray-400 font-medium">Race Weekends</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 F1 Fantasy League. Experience the thrill of Formula 1 team management.
            </p>
          </div>
        </footer>

        {/* Mobile CTA - visible only on mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
          <Link
            to="/signup"
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 px-8 rounded-xl font-bold text-lg text-center block"
          >
            GET STARTED
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
