"use client";

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Trophy, Zap, Star, ChevronRight } from 'lucide-react';

export default function TeamCard() {
  const [hoveredDriver, setHoveredDriver] = useState<"max" | "lewis" | null>(null);

  return (
    <div className="relative z-10 p-4">
      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-800 via-red-900 to-red-950 shadow-2xl">
        {/* Racing Stripes Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
        </div>
        
        {/* Glowing Border Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-red-400 opacity-30 animate-pulse"></div>
        
        {/* Content Container */}
        <div className="relative p-8 backdrop-blur-sm">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Trophy className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">Your Team</h3>
                <p className="text-red-100 text-sm font-medium">Formula 1 Fantasy</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black px-6 py-2 rounded-xl font-black text-lg shadow-lg">
                $100M
              </div>
              <p className="text-red-100 text-xs mt-1 font-medium">Budget Remaining</p>
            </div>
          </div>

          {/* Drivers Section */}
          <div className="space-y-4 mb-8">
            {/* Driver 1 - Max Verstappen */}
            <div 
              className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-5 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
              onMouseEnter={() => setHoveredDriver('max')}
              onMouseLeave={() => setHoveredDriver(null)}
            >
              {/* Performance Indicator */}
              <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-green-400 to-emerald-500"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center font-black text-white text-lg">
                      VER
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-black" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-black text-white text-lg">Max Verstappen</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-red-100 text-sm font-medium">Red Bull Racing</span>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-black text-white text-xl">$32M</div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-bold text-sm">+156 pts</span>
                  </div>
                </div>
              </div>
              
              {/* Hover Animation Line */}
              <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-yellow-400 transition-all duration-300 ${hoveredDriver === 'max' ? 'w-full' : 'w-0'}`}></div>
            </div>

            {/* Driver 2 - Lewis Hamilton */}
            <div 
              className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-5 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
              onMouseEnter={() => setHoveredDriver('lewis')}
              onMouseLeave={() => setHoveredDriver(null)}
            >
              {/* Performance Indicator */}
              <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-green-400 to-emerald-500"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center font-black text-white text-lg">
                      HAM
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-black text-white text-lg">Lewis Hamilton</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-red-100 text-sm font-medium">Ferrari</span>
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-black text-white text-xl">$28M</div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-bold text-sm">+142 pts</span>
                  </div>
                </div>
              </div>
              
              {/* Hover Animation Line */}
              <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-yellow-400 transition-all duration-300 ${hoveredDriver === 'lewis' ? 'w-full' : 'w-0'}`}></div>
            </div>
          </div>

          {/* Action Button */}
          <Link href='/login'>
            <button className="w-full bg-[#00000098] text-white py-3 font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center group">
            MANAGE TEAM
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          </Link>
          
        </div>
      </div>
    </div>
  );
}