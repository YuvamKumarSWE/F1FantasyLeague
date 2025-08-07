"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Medal,
  Crown,
  Target
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  rank: number;
  username: string;
  points: number;
  lastWeekPoints: number;
  weeklyChange: number;
  teamValue: number;
  country: string;
  isCurrentUser: boolean;
}

const LeaderboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'global' | 'friends'>('global');

  const leaderboardData: LeaderboardUser[] = [
    { id: '1', rank: 1, username: 'F1Master2025', points: 2156, lastWeekPoints: 89, weeklyChange: 2, teamValue: 98.5, country: 'GBR', isCurrentUser: false },
    { id: '2', rank: 2, username: 'SpeedDemon', points: 2134, lastWeekPoints: 156, weeklyChange: -1, teamValue: 97.2, country: 'USA', isCurrentUser: false },
    { id: '3', rank: 3, username: 'RedBullFan', points: 2098, lastWeekPoints: 134, weeklyChange: 1, teamValue: 96.8, country: 'NED', isCurrentUser: false },
    { id: '4', rank: 4, username: 'TifosiFever', points: 2067, lastWeekPoints: 178, weeklyChange: 3, teamValue: 95.1, country: 'ITA', isCurrentUser: false },
    { id: '5', rank: 5, username: 'McLarenMagic', points: 2045, lastWeekPoints: 145, weeklyChange: -2, teamValue: 94.7, country: 'AUS', isCurrentUser: false },
    { id: '6', rank: 6, username: 'MercedesFan88', points: 2023, lastWeekPoints: 167, weeklyChange: 4, teamValue: 93.9, country: 'GER', isCurrentUser: false },
    { id: '7', rank: 7, username: 'RacingLegend', points: 2001, lastWeekPoints: 123, weeklyChange: -1, teamValue: 92.3, country: 'ESP', isCurrentUser: false },
    { id: '8', rank: 8, username: 'F1Strategist', points: 1987, lastWeekPoints: 189, weeklyChange: 7, teamValue: 91.8, country: 'FRA', isCurrentUser: false },
    { id: '9', rank: 9, username: 'PolePosition', points: 1976, lastWeekPoints: 142, weeklyChange: -3, teamValue: 90.5, country: 'CAN', isCurrentUser: false },
    { id: '10', rank: 10, username: 'ChampionDriver', points: 1965, lastWeekPoints: 156, weeklyChange: 1, teamValue: 89.7, country: 'BRA', isCurrentUser: false },
    // Add current user somewhere in the middle
    { id: 'current', rank: 12847, username: 'YourUsername', points: 1957, lastWeekPoints: 167, weeklyChange: 156, teamValue: 85.0, country: 'USA', isCurrentUser: true },
  ];

  const filteredUsers = leaderboardData
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.rank - b.rank);

  const topUsers = filteredUsers.slice(0, 10);
  const currentUser = leaderboardData.find(user => user.isCurrentUser);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-yellow-600" />;
      default: return null;
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      'GBR': '🇬🇧', 'USA': '🇺🇸', 'NED': '🇳🇱', 'ITA': '🇮🇹', 'AUS': '🇦🇺',
      'GER': '🇩🇪', 'ESP': '🇪🇸', 'FRA': '🇫🇷', 'CAN': '🇨🇦', 'BRA': '🇧🇷'
    };
    return flags[countryCode] || '🏁';
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 md:mb-8">
        <div className="flex items-center space-x-4 mb-6 md:mb-8 border-b border-gray-800 pb-4 md:pb-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-1 h-6 md:h-8 bg-red-600"></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide">LEADERBOARD</h1>
              <p className="text-gray-400 text-xs md:text-sm font-mono">2025 SEASON • GLOBAL RANKINGS</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          {/* View Mode */}
          <div className="flex space-x-1 bg-gray-900 border border-gray-800 p-1">
            <button
              onClick={() => setViewMode('global')}
              className={`flex-1 py-2 px-4 text-sm font-mono uppercase transition-all ${
                viewMode === 'global' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setViewMode('friends')}
              className={`flex-1 py-2 px-4 text-sm font-mono uppercase transition-all ${
                viewMode === 'friends' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Friends
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {topUsers.slice(0, 3).map((user, index) => (
            <div key={user.id} className={`bg-gray-900 border border-gray-800 p-6 text-center relative ${
              index === 0 ? 'md:order-2 border-yellow-500/30' :
              index === 1 ? 'md:order-1 border-gray-400/30' :
              'md:order-3 border-yellow-600/30'
            }`}>
              <div className="absolute top-2 right-2">
                {getRankIcon(user.rank)}
              </div>
              
              <div className="mb-4">
                <div className={`w-16 h-16 mx-auto flex items-center justify-center text-2xl font-mono font-bold ${
                  index === 0 ? 'bg-yellow-600' : 
                  index === 1 ? 'bg-gray-600' : 
                  'bg-yellow-700'
                } text-white`}>
                  {user.rank}
                </div>
              </div>
              
              <h3 className="text-white font-light text-lg mb-2">{user.username}</h3>
              <div className="text-2xl font-mono text-white mb-2">{user.points.toLocaleString()}</div>
              <div className="text-gray-400 text-xs uppercase mb-4">Points</div>
              
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">{getCountryFlag(user.country)}</span>
                <div className={`flex items-center space-x-1 ${
                  user.weeklyChange > 0 ? 'text-green-400' : 
                  user.weeklyChange < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {user.weeklyChange > 0 ? <TrendingUp className="h-3 w-3" /> : 
                   user.weeklyChange < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                  <span className="text-xs font-mono">
                    {user.weeklyChange > 0 ? '+' : ''}{user.weeklyChange}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rest of Leaderboard */}
        <div className="bg-gray-900 border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-white font-light text-lg uppercase tracking-wide">Full Rankings</h2>
          </div>
          
          <div className="divide-y divide-gray-800">
            {topUsers.slice(3).map((user) => (
              <div key={user.id} className={`p-4 hover:bg-gray-850 transition-colors ${
                user.isCurrentUser ? 'bg-red-900/20 border-l-4 border-red-600' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-gray-500 font-mono text-sm">
                      {String(user.rank).padStart(2, '0')}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCountryFlag(user.country)}</span>
                      <div>
                        <div className={`font-light ${user.isCurrentUser ? 'text-white font-bold' : 'text-white'}`}>
                          {user.username}
                          {user.isCurrentUser && <span className="ml-2 text-red-500 text-sm">(You)</span>}
                        </div>
                        <div className="text-gray-400 text-sm font-mono">${user.teamValue}M Team Value</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right hidden md:block">
                      <div className="text-white font-mono">{user.lastWeekPoints}</div>
                      <div className="text-gray-400 text-xs uppercase">Last Week</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-1 ${
                        user.weeklyChange > 0 ? 'text-green-400' : 
                        user.weeklyChange < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {user.weeklyChange > 0 ? <TrendingUp className="h-3 w-3" /> : 
                         user.weeklyChange < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                        <span className="text-sm font-mono">
                          {user.weeklyChange > 0 ? '+' : ''}{user.weeklyChange}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-mono text-lg">{user.points.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs uppercase">Points</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current User Position (if not in top 10) */}
        {currentUser && currentUser.rank > 10 && (
          <div className="mt-6 bg-gray-900 border border-red-600/30">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-red-600" />
                <h2 className="text-white font-light text-lg uppercase tracking-wide">Your Position</h2>
              </div>
            </div>
            
            <div className="p-4 bg-red-900/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 text-red-400 font-mono text-sm font-bold">
                    #{currentUser.rank.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getCountryFlag(currentUser.country)}</span>
                    <div>
                      <div className="text-white font-bold">{currentUser.username}</div>
                      <div className="text-gray-400 text-sm font-mono">${currentUser.teamValue}M Team Value</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right hidden md:block">
                    <div className="text-white font-mono">{currentUser.lastWeekPoints}</div>
                    <div className="text-gray-400 text-xs uppercase">Last Week</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-mono text-lg">{currentUser.points.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs uppercase">Points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
