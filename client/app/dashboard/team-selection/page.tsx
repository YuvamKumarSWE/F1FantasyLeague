"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  RotateCcw,
  DollarSign,
  Target,
  Users,
  Search,
  Filter,
  User,
  LogOut
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
  availability: 'available' | 'selected' | 'unavailable';
}

const TeamSelection: React.FC = () => {
  const [selectedDrivers, setSelectedDrivers] = useState<(Driver | null)[]>([null, null, null, null, null]);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [draggedDriver, setDraggedDriver] = useState<Driver | null>(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);

  const userStats = {
    username: 'YourUsername',
    budget: 15.0
  };

  // All available drivers
  const allDrivers: Driver[] = [
    { id: '1', name: 'Max Verstappen', code: 'VER', team: 'Red Bull Racing', teamColor: 'from-blue-500 to-blue-700', price: 32.5, points: 478, lastRacePoints: 25, availability: 'selected' },
    { id: '2', name: 'Lewis Hamilton', code: 'HAM', team: 'Ferrari', teamColor: 'from-red-500 to-red-700', price: 28.0, points: 445, lastRacePoints: 18, availability: 'selected' },
    { id: '3', name: 'Charles Leclerc', code: 'LEC', team: 'Ferrari', teamColor: 'from-red-500 to-red-700', price: 25.5, points: 389, lastRacePoints: 15, availability: 'selected' },
    { id: '4', name: 'Lando Norris', code: 'NOR', team: 'McLaren', teamColor: 'from-orange-500 to-orange-700', price: 22.0, points: 356, lastRacePoints: 12, availability: 'selected' },
    { id: '5', name: 'George Russell', code: 'RUS', team: 'Mercedes', teamColor: 'from-gray-400 to-gray-600', price: 20.5, points: 289, lastRacePoints: 10, availability: 'selected' },
    { id: '6', name: 'Sergio Pérez', code: 'PER', team: 'Red Bull Racing', teamColor: 'from-blue-500 to-blue-700', price: 18.5, points: 245, lastRacePoints: 8, availability: 'available' },
    { id: '7', name: 'Carlos Sainz', code: 'SAI', team: 'Williams', teamColor: 'from-blue-400 to-blue-600', price: 16.0, points: 198, lastRacePoints: 6, availability: 'available' },
    { id: '8', name: 'Oscar Piastri', code: 'PIA', team: 'McLaren', teamColor: 'from-orange-500 to-orange-700', price: 15.5, points: 187, lastRacePoints: 4, availability: 'available' },
    { id: '9', name: 'Fernando Alonso', code: 'ALO', team: 'Aston Martin', teamColor: 'from-green-500 to-green-700', price: 14.0, points: 156, lastRacePoints: 2, availability: 'available' },
    { id: '10', name: 'Lance Stroll', code: 'STR', team: 'Aston Martin', teamColor: 'from-green-500 to-green-700', price: 12.5, points: 134, lastRacePoints: 1, availability: 'available' },
  ];

  const teams = ['Red Bull Racing', 'Ferrari', 'Mercedes', 'McLaren', 'Aston Martin', 'Williams'];

  // Initialize selected drivers based on mock data
  useEffect(() => {
    const initialTeam = allDrivers.filter(driver => driver.availability === 'selected').slice(0, 5);
    const newSelectedDrivers = [...selectedDrivers];
    initialTeam.forEach((driver, index) => {
      if (index < 5) {
        newSelectedDrivers[index] = driver;
      }
    });
    setSelectedDrivers(newSelectedDrivers);
  }, []);

  const filteredDrivers = allDrivers.filter(driver => {
    const isNotSelected = !selectedDrivers.some(selected => selected?.id === driver.id);
    return isNotSelected;
  });

  const totalCost = selectedDrivers.reduce((sum, driver) => sum + (driver?.price || 0), 0);
  const remainingBudget = 100 - totalCost;

  const handleDragStart = (driver: Driver, fromSlot?: number) => {
    setDraggedDriver(driver);
    setDraggedFromSlot(fromSlot ?? null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    
    if (!draggedDriver) return;

    const newSelectedDrivers = [...selectedDrivers];
    
    // If dragging from a slot, clear the original slot
    if (draggedFromSlot !== null) {
      newSelectedDrivers[draggedFromSlot] = null;
    }
    
    // If there's already a driver in the target slot, swap them
    const existingDriver = newSelectedDrivers[slotIndex];
    if (existingDriver && draggedFromSlot !== null) {
      newSelectedDrivers[draggedFromSlot] = existingDriver;
    }
    
    // Place the dragged driver in the target slot
    newSelectedDrivers[slotIndex] = draggedDriver;
    
    setSelectedDrivers(newSelectedDrivers);
    setDraggedDriver(null);
    setDraggedFromSlot(null);
  };

  const handleRemoveDriver = (slotIndex: number) => {
    const newSelectedDrivers = [...selectedDrivers];
    newSelectedDrivers[slotIndex] = null;
    setSelectedDrivers(newSelectedDrivers);
  };

  const handleSaveTeam = () => {
    // Add save logic here
    console.log('Saving team:', selectedDrivers);
  };

  const handleResetTeam = () => {
    setSelectedDrivers([null, null, null, null, null]);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white"></div>
                </div>
                <span className="text-white font-light text-lg tracking-wide">F1 FANTASY</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-400 font-mono text-sm uppercase tracking-wider hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/drivers" className="text-gray-400 font-mono text-sm uppercase tracking-wider hover:text-white transition-colors">
                  Drivers
                </Link>
                <Link href="/dashboard/constructors" className="text-gray-400 font-mono text-sm uppercase tracking-wider hover:text-white transition-colors">
                  Constructors
                </Link>
                <Link href="/dashboard/leaderboard" className="text-gray-400 font-mono text-sm uppercase tracking-wider hover:text-white transition-colors">
                  Leaderboard
                </Link>
                <span className="text-white font-mono text-sm uppercase tracking-wider">Team Selection</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-white font-mono text-sm">{userStats.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-mono text-sm uppercase tracking-wider">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-mono text-sm uppercase tracking-wider">Back to Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-gray-800"></div>
              <div>
                <h1 className="text-3xl font-light text-white tracking-wide">TEAM SELECTION</h1>
                <p className="text-gray-400 text-sm font-mono">Build your lineup for the next race</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-900 border border-gray-800 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-white font-mono">${remainingBudget.toFixed(1)}M</span>
                  <span className="text-gray-400 text-sm">remaining</span>
                </div>
              </div>
              <button
                onClick={handleResetTeam}
                className="flex items-center space-x-2 border border-gray-700 text-gray-400 px-4 py-2 hover:bg-gray-800 hover:text-white transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="font-mono text-sm uppercase">Reset</span>
              </button>
              <button
                onClick={handleSaveTeam}
                className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-all"
              >
                <Save className="h-4 w-4" />
                <span className="font-mono text-sm uppercase">Save Team</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Drag and Drop Team Selection Area */}
          <div className="bg-gray-900 border border-gray-800 p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-1 h-6 bg-red-600"></div>
              <div>
                <h2 className="text-xl font-light text-white uppercase tracking-wide">Your Team</h2>
                <p className="text-gray-400 text-sm font-mono">Drag drivers here to build your lineup</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {selectedDrivers.map((driver, index) => (
                <div
                  key={index}
                  className={`border-2 border-dashed ${index === 0 ? 'border-yellow-500 bg-yellow-900/20' : 'border-gray-700 bg-gray-800'} p-4 min-h-[120px] flex flex-col items-center justify-center hover:border-gray-600 transition-colors`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {driver ? (
                    <div 
                      className="w-full text-center cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(driver, index)}
                    >
                      <div className={`w-12 h-12 ${index === 0 ? 'bg-yellow-600' : 'bg-gray-700'} mx-auto mb-2 flex items-center justify-center`}>
                        <span className="text-white font-mono text-sm">{driver.code}</span>
                      </div>
                      <div className="text-white text-sm font-light mb-1">{driver.name}</div>
                      <div className="text-gray-400 text-xs font-mono mb-2">{driver.team}</div>
                      <div className="text-green-400 font-mono text-sm">${driver.price}M</div>
                      {index === 0 && (
                        <div className="text-yellow-400 font-mono text-xs uppercase mt-1">Captain</div>
                      )}
                      <button
                        onClick={() => handleRemoveDriver(index)}
                        className="mt-2 text-red-400 hover:text-red-300 text-xs font-mono uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm font-mono">
                        {index === 0 ? 'Captain' : `Slot ${index + 1}`}
                      </div>
                      <div className="text-xs">
                        {index === 0 ? 'Drag team captain here' : 'Drag driver here'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-gray-400 font-mono text-sm">Team Cost: </span>
                  <span className="text-white font-mono">${totalCost.toFixed(1)}M / $100M</span>
                </div>
                <div>
                  <span className="text-gray-400 font-mono text-sm">Drivers Selected: </span>
                  <span className="text-white font-mono">{selectedDrivers.filter(d => d !== null).length} / 5</span>
                </div>
              </div>
              {remainingBudget < 0 && (
                <div className="text-red-400 font-mono text-sm">
                  Over budget by ${Math.abs(remainingBudget).toFixed(1)}M
                </div>
              )}
            </div>
          </div>

          {/* Driver Selection Area */}
          <div className="bg-gray-900 border border-gray-800 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-1 h-6 bg-red-600"></div>
                <div>
                  <h2 className="text-xl font-light text-white uppercase tracking-wide">Available Drivers</h2>
                  <p className="text-gray-400 text-sm font-mono">Drag drivers to your team above</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="border border-gray-800 bg-gray-800 p-4 hover:bg-gray-750 transition-colors cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(driver)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-700 flex items-center justify-center">
                      <span className="text-white font-mono text-sm">{driver.code}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-light">{driver.name}</div>
                      <div className="text-gray-400 text-sm font-mono">{driver.team}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-mono text-sm">${driver.price}M</div>
                      <div className="text-white font-mono text-xs">{driver.points} pts</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSelection;