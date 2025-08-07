"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Star
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
  form: number;
  nationality: string;
  age: number;
  championships: number;
  raceWins: number;
  podiums: number;
  selected: boolean;
}

const DriversPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('points');
  const [filterTeam, setFilterTeam] = useState('all');

  const drivers: Driver[] = [
    { id: '1', name: 'Max Verstappen', code: 'VER', team: 'Red Bull Racing', teamColor: 'bg-blue-600', price: 32.5, points: 478, lastRacePoints: 25, form: 8.5, nationality: 'NED', age: 27, championships: 3, raceWins: 56, podiums: 98, selected: true },
    { id: '2', name: 'Lewis Hamilton', code: 'HAM', team: 'Ferrari', teamColor: 'bg-red-600', price: 28.0, points: 445, lastRacePoints: 18, form: 7.8, nationality: 'GBR', age: 40, championships: 7, raceWins: 105, podiums: 198, selected: true },
    { id: '3', name: 'Charles Leclerc', code: 'LEC', team: 'Ferrari', teamColor: 'bg-red-600', price: 25.5, points: 389, lastRacePoints: 15, form: 7.5, nationality: 'MON', age: 27, championships: 0, raceWins: 5, podiums: 29, selected: true },
    { id: '4', name: 'Lando Norris', code: 'NOR', team: 'McLaren', teamColor: 'bg-orange-600', price: 22.0, points: 356, lastRacePoints: 12, form: 7.2, nationality: 'GBR', age: 25, championships: 0, raceWins: 1, podiums: 13, selected: true },
    { id: '5', name: 'George Russell', code: 'RUS', team: 'Mercedes', teamColor: 'bg-gray-500', price: 20.5, points: 289, lastRacePoints: 10, form: 6.8, nationality: 'GBR', age: 26, championships: 0, raceWins: 2, podiums: 11, selected: true },
    { id: '6', name: 'Oscar Piastri', code: 'PIA', team: 'McLaren', teamColor: 'bg-orange-600', price: 18.0, points: 267, lastRacePoints: 8, form: 7.0, nationality: 'AUS', age: 23, championships: 0, raceWins: 2, podiums: 8, selected: false },
    { id: '7', name: 'Carlos Sainz', code: 'SAI', team: 'Williams', teamColor: 'bg-blue-400', price: 16.5, points: 234, lastRacePoints: 6, form: 6.5, nationality: 'ESP', age: 30, championships: 0, raceWins: 3, podiums: 23, selected: false },
    { id: '8', name: 'Sergio Perez', code: 'PER', team: 'Red Bull Racing', teamColor: 'bg-blue-600', price: 15.0, points: 198, lastRacePoints: 4, form: 5.8, nationality: 'MEX', age: 35, championships: 0, raceWins: 6, podiums: 39, selected: false },
    { id: '9', name: 'Fernando Alonso', code: 'ALO', team: 'Aston Martin', teamColor: 'bg-green-600', price: 14.5, points: 187, lastRacePoints: 2, form: 6.2, nationality: 'ESP', age: 43, championships: 2, raceWins: 32, podiums: 106, selected: false },
    { id: '10', name: 'Pierre Gasly', code: 'GAS', team: 'Alpine', teamColor: 'bg-pink-600', price: 12.0, points: 156, lastRacePoints: 1, form: 5.9, nationality: 'FRA', age: 28, championships: 0, raceWins: 1, podiums: 4, selected: false },
  ];

  const teams = [...new Set(drivers.map(d => d.team))];

  const filteredDrivers = drivers
    .filter(driver => 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(driver => filterTeam === 'all' || driver.team === filterTeam)
    .sort((a, b) => {
      switch (sortBy) {
        case 'points': return b.points - a.points;
        case 'price': return b.price - a.price;
        case 'form': return b.form - a.form;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex items-center space-x-4 mb-6 md:mb-8 border-b border-gray-800 pb-4 md:pb-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-1 h-6 md:h-8 bg-red-600"></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide">DRIVERS</h1>
              <p className="text-gray-400 text-xs md:text-sm font-mono">2025 SEASON • ALL COMPETITORS</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-red-600 transition-colors"
          >
            <option value="points">Sort by Points</option>
            <option value="price">Sort by Price</option>
            <option value="form">Sort by Form</option>
            <option value="name">Sort by Name</option>
          </select>

          {/* Filter */}
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-red-600 transition-colors"
          >
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="bg-gray-900 border border-gray-800 p-6 hover:bg-gray-850 transition-colors relative">
              {driver.selected && (
                <div className="absolute top-2 right-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${driver.teamColor} flex items-center justify-center`}>
                    <span className="text-white font-mono text-sm font-bold">{driver.code}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-light text-lg">{driver.name}</h3>
                    <p className="text-gray-400 text-sm font-mono">{driver.team}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-mono text-lg">${driver.price}M</div>
                  <div className="text-gray-400 text-xs uppercase">Price</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-white font-mono text-lg">{driver.points}</div>
                  <div className="text-gray-400 text-xs uppercase">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-mono text-lg">+{driver.lastRacePoints}</div>
                  <div className="text-gray-400 text-xs uppercase">Last Race</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-white font-mono text-lg">{driver.form}</span>
                    {driver.form > 7 ? 
                      <TrendingUp className="h-3 w-3 text-green-400" /> : 
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    }
                  </div>
                  <div className="text-gray-400 text-xs uppercase">Form</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <div className="text-white font-mono">{driver.championships}</div>
                  <div className="text-gray-500 uppercase">WDC</div>
                </div>
                <div>
                  <div className="text-white font-mono">{driver.raceWins}</div>
                  <div className="text-gray-500 uppercase">Wins</div>
                </div>
                <div>
                  <div className="text-white font-mono">{driver.podiums}</div>
                  <div className="text-gray-500 uppercase">Podiums</div>
                </div>
                <div>
                  <div className="text-white font-mono">{driver.age}</div>
                  <div className="text-gray-500 uppercase">Age</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <button 
                  className={`w-full py-2 text-sm font-mono uppercase tracking-wide transition-all ${
                    driver.selected 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'border border-gray-700 text-white hover:bg-gray-800'
                  }`}
                >
                  {driver.selected ? 'In Team' : 'Add to Team'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriversPage;