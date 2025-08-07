"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Users
} from 'lucide-react';

interface Constructor {
  id: string;
  name: string;
  shortName: string;
  color: string;
  points: number;
  lastRacePoints: number;
  position: number;
  drivers: string[];
  championships: number;
  raceWins: number;
  podiums: number;
  founded: number;
  nationality: string;
  form: number;
}

const ConstructorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('points');

  const constructors: Constructor[] = [
    { 
      id: '1', 
      name: 'Red Bull Racing', 
      shortName: 'RBR', 
      color: 'bg-blue-600', 
      points: 676, 
      lastRacePoints: 29, 
      position: 1, 
      drivers: ['Max Verstappen', 'Sergio Perez'], 
      championships: 6, 
      raceWins: 118, 
      podiums: 245, 
      founded: 2005, 
      nationality: 'Austria', 
      form: 8.2 
    },
    { 
      id: '2', 
      name: 'Scuderia Ferrari', 
      shortName: 'FER', 
      color: 'bg-red-600', 
      points: 634, 
      lastRacePoints: 33, 
      position: 2, 
      drivers: ['Lewis Hamilton', 'Charles Leclerc'], 
      championships: 16, 
      raceWins: 243, 
      podiums: 806, 
      founded: 1950, 
      nationality: 'Italy', 
      form: 7.6 
    },
    { 
      id: '3', 
      name: 'McLaren', 
      shortName: 'MCL', 
      color: 'bg-orange-600', 
      points: 623, 
      lastRacePoints: 20, 
      position: 3, 
      drivers: ['Lando Norris', 'Oscar Piastri'], 
      championships: 8, 
      raceWins: 183, 
      podiums: 498, 
      founded: 1966, 
      nationality: 'United Kingdom', 
      form: 7.1 
    },
    { 
      id: '4', 
      name: 'Mercedes', 
      shortName: 'MER', 
      color: 'bg-gray-500', 
      points: 289, 
      lastRacePoints: 10, 
      position: 4, 
      drivers: ['George Russell', 'Kimi Antonelli'], 
      championships: 8, 
      raceWins: 125, 
      podiums: 278, 
      founded: 2010, 
      nationality: 'Germany', 
      form: 6.8 
    },
    { 
      id: '5', 
      name: 'Aston Martin', 
      shortName: 'AMR', 
      color: 'bg-green-600', 
      points: 234, 
      lastRacePoints: 8, 
      position: 5, 
      drivers: ['Fernando Alonso', 'Lance Stroll'], 
      championships: 0, 
      raceWins: 1, 
      podiums: 13, 
      founded: 2021, 
      nationality: 'United Kingdom', 
      form: 6.2 
    },
    { 
      id: '6', 
      name: 'Alpine', 
      shortName: 'ALP', 
      color: 'bg-pink-600', 
      points: 198, 
      lastRacePoints: 6, 
      position: 6, 
      drivers: ['Pierre Gasly', 'Esteban Ocon'], 
      championships: 2, 
      raceWins: 21, 
      podiums: 103, 
      founded: 2021, 
      nationality: 'France', 
      form: 5.9 
    },
    { 
      id: '7', 
      name: 'Williams', 
      shortName: 'WIL', 
      color: 'bg-blue-400', 
      points: 178, 
      lastRacePoints: 4, 
      position: 7, 
      drivers: ['Carlos Sainz', 'Alex Albon'], 
      championships: 9, 
      raceWins: 114, 
      podiums: 313, 
      founded: 1977, 
      nationality: 'United Kingdom', 
      form: 6.5 
    },
    { 
      id: '8', 
      name: 'Visa RB', 
      shortName: 'VRB', 
      color: 'bg-indigo-600', 
      points: 156, 
      lastRacePoints: 2, 
      position: 8, 
      drivers: ['Yuki Tsunoda', 'Liam Lawson'], 
      championships: 0, 
      raceWins: 2, 
      podiums: 3, 
      founded: 2020, 
      nationality: 'Italy', 
      form: 5.4 
    },
    { 
      id: '9', 
      name: 'Haas', 
      shortName: 'HAS', 
      color: 'bg-gray-700', 
      points: 134, 
      lastRacePoints: 1, 
      position: 9, 
      drivers: ['Nico Hulkenberg', 'Kevin Magnussen'], 
      championships: 0, 
      raceWins: 0, 
      podiums: 0, 
      founded: 2016, 
      nationality: 'United States', 
      form: 5.1 
    },
    { 
      id: '10', 
      name: 'Sauber', 
      shortName: 'SAU', 
      color: 'bg-green-800', 
      points: 89, 
      lastRacePoints: 0, 
      position: 10, 
      drivers: ['Valtteri Bottas', 'Zhou Guanyu'], 
      championships: 0, 
      raceWins: 1, 
      podiums: 26, 
      founded: 1993, 
      nationality: 'Switzerland', 
      form: 4.8 
    }
  ];

  const filteredConstructors = constructors
    .filter(constructor => 
      constructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      constructor.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      constructor.drivers.some(driver => driver.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'points': return b.points - a.points;
        case 'position': return a.position - b.position;
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
              <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide">CONSTRUCTORS</h1>
              <p className="text-gray-400 text-xs md:text-sm font-mono">2025 SEASON • TEAM STANDINGS</p>
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
              placeholder="Search constructors..."
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
            <option value="position">Sort by Position</option>
            <option value="form">Sort by Form</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Constructors Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredConstructors.map((constructor) => (
            <div key={constructor.id} className="bg-gray-900 border border-gray-800 p-6 hover:bg-gray-850 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-500 font-mono text-lg font-bold">
                      {String(constructor.position).padStart(2, '0')}
                    </div>
                    <div className={`w-12 h-12 ${constructor.color} flex items-center justify-center`}>
                      <span className="text-white font-mono text-sm font-bold">{constructor.shortName}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-light text-xl">{constructor.name}</h3>
                    <p className="text-gray-400 text-sm font-mono">{constructor.nationality}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-mono text-2xl">{constructor.points}</div>
                  <div className="text-gray-400 text-xs uppercase">Points</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-green-400 font-mono text-lg">+{constructor.lastRacePoints}</div>
                  <div className="text-gray-400 text-xs uppercase">Last Race</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-white font-mono text-lg">{constructor.form}</span>
                    {constructor.form > 7 ? 
                      <TrendingUp className="h-3 w-3 text-green-400" /> : 
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    }
                  </div>
                  <div className="text-gray-400 text-xs uppercase">Form</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-mono text-lg">{constructor.championships}</div>
                  <div className="text-gray-400 text-xs uppercase">Titles</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm font-mono uppercase tracking-wide">Drivers</span>
                </div>
                <div className="space-y-2">
                  {constructor.drivers.map((driver, index) => (
                    <div key={index} className="bg-gray-800 p-3 flex items-center justify-between">
                      <span className="text-white font-light">{driver}</span>
                      <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center text-sm border-t border-gray-800 pt-4">
                <div>
                  <div className="text-white font-mono">{constructor.raceWins}</div>
                  <div className="text-gray-500 text-xs uppercase">Wins</div>
                </div>
                <div>
                  <div className="text-white font-mono">{constructor.podiums}</div>
                  <div className="text-gray-500 text-xs uppercase">Podiums</div>
                </div>
                <div>
                  <div className="text-white font-mono">{constructor.founded}</div>
                  <div className="text-gray-500 text-xs uppercase">Founded</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConstructorsPage;
