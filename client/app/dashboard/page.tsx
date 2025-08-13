"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Star, 
  Calendar,
  ChevronRight,
  Target,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  code: string;
  team: string;
  teamColor: string;
  price: number;
  points: number;
  lastRacePoints: number;
  headshot?: string;
}

interface RaceInfo {
  name: string;
  track: string;
  location: string;
  date: string;
  deadline: string;
}

const Dashboard: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const [selectedTab, setSelectedTab] = useState('performance');

  // Mock data - replace with actual API calls
  const myTeam: Driver[] = [
    { id: '1', name: 'Max Verstappen', code: 'VER', team: 'Red Bull Racing', teamColor: 'from-blue-500 to-blue-700', price: 32.5, points: 478, lastRacePoints: 25 },
    { id: '2', name: 'Lewis Hamilton', code: 'HAM', team: 'Ferrari', teamColor: 'from-red-500 to-red-700', price: 28.0, points: 445, lastRacePoints: 18 },
    { id: '3', name: 'Charles Leclerc', code: 'LEC', team: 'Ferrari', teamColor: 'from-red-500 to-red-700', price: 25.5, points: 389, lastRacePoints: 15 },
    { id: '4', name: 'Lando Norris', code: 'NOR', team: 'McLaren', teamColor: 'from-orange-500 to-orange-700', price: 22.0, points: 356, lastRacePoints: 12 },
    { id: '5', name: 'George Russell', code: 'RUS', team: 'Mercedes', teamColor: 'from-gray-400 to-gray-600', price: 20.5, points: 289, lastRacePoints: 10 }
  ];

  const upcomingRace: RaceInfo = {
    name: 'Monaco Grand Prix',
    track: 'Circuit de Monaco',
    location: 'Monte Carlo, Monaco',
    date: '2025-05-25',
    deadline: '2025-05-23T14:00:00Z'
  };

  const userStats = {
    totalPoints: 1957,
    globalRank: 12847,
    weeklyRank: 2341,
    budget: 15.0
  };

  const leaderboard = [
    { rank: 1, name: 'F1Master2025', points: 2156 },
    { rank: 2, name: 'SpeedDemon', points: 2134 },
    { rank: 3, name: 'RedBullFan', points: 2098 },
    { rank: 4, name: 'TifosiFever', points: 2067 },
    { rank: 5, name: 'McLarenMagic', points: 2045 }
  ];

  const weeklyProgress = [
    { week: 'W1', points: 89 },
    { week: 'W2', points: 156 },
    { week: 'W3', points: 134 },
    { week: 'W4', points: 178 },
    { week: 'W5', points: 145 },
    { week: 'W6', points: 167 }
  ];

  const aiTips = [
    { type: 'underrated', icon: Star, text: 'Oscar Piastri showing strong pace - consider as budget option' },
    { type: 'value', icon: DollarSign, text: 'Alpine drivers offering excellent value for upcoming races' },
    { type: 'warning', icon: AlertTriangle, text: 'Rain expected in Monaco - reliability crucial this weekend' }
  ];

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const deadline = new Date(upcomingRace.deadline).getTime();
      const distance = deadline - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft('Deadline passed');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, [upcomingRace.deadline]);

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4 md:mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 border-b border-gray-800 pb-4 md:pb-6">
          <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 flex items-center justify-center">
              <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-light text-white tracking-wide">FORMULA 1 FANTASY</h1>
              <p className="text-gray-400 text-xs md:text-sm font-mono">2025 SEASON</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-center md:text-right">
              <div className="text-lg md:text-2xl font-mono text-white">
                {userStats.totalPoints.toLocaleString()}
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-widest">Total Points</p>
            </div>
            <div className="w-px h-8 md:h-12 bg-gray-800"></div>
            <div className="text-center md:text-right">
              <div className="text-lg md:text-xl font-mono text-white">
                #{userStats.globalRank.toLocaleString()}
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-widest">Global Rank</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Left Column - Team & Performance */}
        <div className="xl:col-span-3 space-y-4 md:space-y-6">
          {/* Fantasy Team Summary */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-0">
                <div className="w-1 h-6 md:h-8 bg-red-600"></div>
                <div>
                  <h2 className="text-lg md:text-xl font-light text-white uppercase tracking-wide">Team Selection</h2>
                  <p className="text-gray-400 text-xs md:text-sm font-mono">Budget Used: ${(100 - userStats.budget).toFixed(1)}M / $100M</p>
                </div>
              </div>
              <button className="border border-gray-700 text-white px-4 md:px-6 py-2 text-xs md:text-sm font-mono uppercase tracking-wide hover:bg-gray-800 transition-all w-full md:w-auto">
                Modify Lineup
              </button>
            </div>

            <div className="space-y-1">
              {myTeam.map((driver, index) => (
                <div key={driver.id} className="border-b border-gray-800 last:border-b-0 py-3 md:py-4 hover:bg-gray-850 transition-colors">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
                    <div className="flex items-center space-x-4 md:space-x-6 w-full md:w-auto">
                      <div className="w-6 md:w-8 text-gray-500 font-mono text-xs md:text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 flex items-center justify-center">
                          <span className="text-white font-mono text-xs md:text-sm">{driver.code}</span>
                        </div>
                        <div>
                          <div className="text-white font-light text-base md:text-lg">{driver.name}</div>
                          <div className="text-gray-400 text-xs md:text-sm font-mono">{driver.team}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end space-x-6 md:space-x-8 text-right w-full md:w-auto">
                      <div>
                        <div className="text-white font-mono text-sm md:text-base">${driver.price}M</div>
                        <div className="text-gray-400 text-xs uppercase">Price</div>
                      </div>
                      <div>
                        <div className="text-white font-mono text-sm md:text-base">{driver.points}</div>
                        <div className="text-gray-400 text-xs uppercase">Points</div>
                      </div>
                      <div>
                        <div className="text-green-400 font-mono text-sm md:text-base">+{driver.lastRacePoints}</div>
                        <div className="text-gray-400 text-xs uppercase">Last Race</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-800 flex justify-between items-center">
              <span className="text-gray-400 font-mono text-xs md:text-sm uppercase tracking-wide">Remaining Budget</span>
              <span className="text-white font-mono text-base md:text-lg">${userStats.budget.toFixed(1)}M</span>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Last Race Performance */}
            <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-0">
                  <div className="w-1 h-5 md:h-6 bg-red-600"></div>
                  <h3 className="text-base md:text-lg font-light text-white uppercase tracking-wide">Race Performance</h3>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setSelectedTab('performance')}
                    className={`px-2 md:px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all ${selectedTab === 'performance' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Points
                  </button>
                  <button 
                    onClick={() => setSelectedTab('breakdown')}
                    className={`px-2 md:px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all ${selectedTab === 'breakdown' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Breakdown
                  </button>
                </div>
              </div>

              {selectedTab === 'performance' ? (
                <div className="space-y-2">
                  {myTeam.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-800 flex items-center justify-center">
                          <span className="text-white font-mono text-xs">{driver.code}</span>
                        </div>
                        <span className="text-white font-light text-sm">{driver.name.split(' ').pop()}</span>
                      </div>
                      <div className="text-green-400 font-mono text-sm">+{driver.lastRacePoints}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-gray-800 p-3 md:p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Qualifying</div>
                    <div className="text-white font-mono text-lg md:text-xl">23</div>
                  </div>
                  <div className="bg-gray-800 p-3 md:p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Race Position</div>
                    <div className="text-white font-mono text-lg md:text-xl">45</div>
                  </div>
                  <div className="bg-gray-800 p-3 md:p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Fastest Lap</div>
                    <div className="text-white font-mono text-lg md:text-xl">8</div>
                  </div>
                  <div className="bg-gray-800 p-3 md:p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Bonus</div>
                    <div className="text-white font-mono text-lg md:text-xl">4</div>
                  </div>
                </div>
              )}
            </div>

            {/* Weekly Progress Chart */}
            <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
                <div className="w-1 h-5 md:h-6 bg-red-600"></div>
                <h3 className="text-base md:text-lg font-light text-white uppercase tracking-wide">Season Progress</h3>
              </div>
              <div className="flex items-end justify-between h-24 md:h-32 space-x-1">
                {weeklyProgress.map((week) => (
                  <div key={week.week} className="flex-1 flex flex-col items-center group">
                    <div 
                      className="w-full bg-gray-700 hover:bg-red-600 transition-colors cursor-pointer"
                      style={{ height: `${(week.points / 200) * 100}%` }}
                    ></div>
                    <div className="text-gray-400 text-xs mt-2 font-mono">{week.week}</div>
                    <div className="text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">{week.points}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Upcoming Race Info */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
            <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
              <div className="w-1 h-5 md:h-6 bg-red-600"></div>
              <h3 className="text-base md:text-lg font-light text-white uppercase tracking-wide">Next Race</h3>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <h4 className="text-white font-light text-lg md:text-xl mb-1">{upcomingRace.name}</h4>
                <p className="text-gray-400 text-sm font-mono">{upcomingRace.track}</p>
                <p className="text-gray-500 text-xs font-mono uppercase">{upcomingRace.location}</p>
              </div>
              
              <div className="bg-gray-800 p-3 md:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                  <span className="text-white text-xs md:text-sm font-mono uppercase tracking-wider">Deadline</span>
                </div>
                <div className="text-white font-mono text-base md:text-lg">{timeLeft}</div>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-400">
                <Calendar className="h-3 w-3" />
                <span className="text-xs font-mono">{new Date(upcomingRace.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-1 h-5 md:h-6 bg-red-600"></div>
                <h3 className="text-base md:text-lg font-light text-white uppercase tracking-wide">Leaderboard</h3>
              </div>
              <Link href="/dashboard/leaderboard" className="text-gray-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-1 mb-4 md:mb-6">
              {leaderboard.map((user) => (
                <div key={user.rank} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-5 md:w-6 text-gray-500 font-mono text-xs">
                      {String(user.rank).padStart(2, '0')}
                    </div>
                    <span className="text-white font-light text-sm">{user.name}</span>
                  </div>
                  <span className="text-white font-mono text-sm">{user.points.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 p-3 md:p-4 border-l-2 border-red-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                  <span className="text-white font-mono text-xs md:text-sm uppercase tracking-wider">Your Position</span>
                </div>
                <span className="text-white font-mono text-sm md:text-base">#{userStats.globalRank.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
            <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
              <div className="w-1 h-5 md:h-6 bg-red-600"></div>
              <h3 className="text-base md:text-lg font-light text-white uppercase tracking-wide">Navigation</h3>
            </div>

            <div className="space-y-2">
              <Link href="/dashboard/drivers" className="block bg-gray-800 p-3 hover:bg-gray-700 transition-colors border-l-2 border-gray-700 hover:border-red-600">
                <div className="text-white font-mono text-sm uppercase tracking-wider">Drivers</div>
                <div className="text-gray-400 text-xs">Browse all drivers & stats</div>
              </Link>
              <Link href="/dashboard/constructors" className="block bg-gray-800 p-3 hover:bg-gray-700 transition-colors border-l-2 border-gray-700 hover:border-red-600">
                <div className="text-white font-mono text-sm uppercase tracking-wider">Constructors</div>
                <div className="text-gray-400 text-xs">Team standings & info</div>
              </Link>
              <Link href="/dashboard/analytics" className="block bg-gray-800 p-3 hover:bg-gray-700 transition-colors border-l-2 border-gray-700 hover:border-red-600">
                <div className="text-white font-mono text-sm uppercase tracking-wider">Analytics</div>
                <div className="text-gray-400 text-xs">Advanced team insights</div>
              </Link>
            </div>
          </div>

          {/* Strategy Insights */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
            <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
              <div className="w-1 h-5 md:h-6 bg-red-600"></div>
              <h3 className="text-base md:text-lg font-light text-white uppercase tracking-wide">Strategy</h3>
            </div>

            <div className="space-y-3 md:space-y-4">
              {aiTips.map((tip, index) => (
                <div key={index} className="bg-gray-800 p-3 md:p-4 border-l-2 border-gray-700">
                  <div className="flex items-start space-x-3">
                    <tip.icon className={`h-3 w-3 md:h-4 md:w-4 mt-0.5 ${
                      tip.type === 'warning' ? 'text-yellow-500' : 
                      tip.type === 'value' ? 'text-green-500' : 'text-blue-500'
                    }`} />
                    <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/dashboard/analytics" className="block w-full mt-4 md:mt-6 border border-gray-700 text-white py-2 md:py-3 text-xs md:text-sm font-mono uppercase tracking-wide hover:bg-gray-800 transition-all text-center">
              Advanced Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;