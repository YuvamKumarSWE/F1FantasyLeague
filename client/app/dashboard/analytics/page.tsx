"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  AlertTriangle,
  Activity
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('season');

  const performanceData = [
    { week: 'W1', points: 89, rank: 15234 },
    { week: 'W2', points: 156, rank: 12456 },
    { week: 'W3', points: 134, rank: 13789 },
    { week: 'W4', points: 178, rank: 11234 },
    { week: 'W5', points: 145, rank: 12567 },
    { week: 'W6', points: 167, rank: 12847 },
  ];

  const driverAnalysis = [
    { name: 'Max Verstappen', owned: 89, points: 478, avgPoints: 19.9, efficiency: 95, trend: 'up' },
    { name: 'Lewis Hamilton', owned: 67, points: 445, avgPoints: 18.5, efficiency: 87, trend: 'up' },
    { name: 'Charles Leclerc', owned: 78, points: 389, avgPoints: 16.2, efficiency: 82, trend: 'down' },
    { name: 'Lando Norris', owned: 56, points: 356, avgPoints: 14.8, efficiency: 79, trend: 'up' },
    { name: 'George Russell', owned: 45, points: 289, avgPoints: 12.0, efficiency: 71, trend: 'down' },
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Strong Driver Selection',
      description: 'Your current lineup outperforms 73% of all fantasy teams',
      impact: 'high'
    },
    {
      type: 'warning',
      title: 'Budget Optimization',
      description: 'Consider upgrading your 5th driver with remaining budget',
      impact: 'medium'
    },
    {
      type: 'neutral',
      title: 'Consistent Performance',
      description: 'Your team shows stable week-to-week point generation',
      impact: 'low'
    },
    {
      type: 'negative',
      title: 'Constructor Diversity',
      description: 'Over-reliance on Ferrari drivers may limit point potential',
      impact: 'medium'
    }
  ];

  const recommendations = [
    {
      action: 'Consider',
      driver: 'Oscar Piastri',
      reason: 'Undervalued at $18M with consistent point scoring',
      probability: 85
    },
    {
      action: 'Avoid',
      driver: 'Sergio Perez',
      reason: 'Poor form and high price relative to recent performance',
      probability: 92
    },
    {
      action: 'Monitor',
      driver: 'Fernando Alonso',
      reason: 'Age concerns but still competitive in key races',
      probability: 67
    }
  ];

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
              <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide">ANALYTICS</h1>
              <p className="text-gray-400 text-xs md:text-sm font-mono">ADVANCED TEAM INSIGHTS & STRATEGY</p>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-1 bg-gray-900 border border-gray-800 p-1 w-fit">
          {['season', 'month', 'week'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 text-sm font-mono uppercase transition-all ${
                selectedTimeframe === timeframe ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Charts & Performance */}
        <div className="xl:col-span-2 space-y-4 md:space-y-6">
          {/* Performance Trends */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
            <div className="flex items-center space-x-3 md:space-x-4 mb-6">
              <div className="w-1 h-6 bg-red-600"></div>
              <h2 className="text-lg md:text-xl font-light text-white uppercase tracking-wide">Performance Trends</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 p-4 text-center">
                <div className="text-2xl font-mono text-white mb-1">1,957</div>
                <div className="text-gray-400 text-xs uppercase">Total Points</div>
                <div className="flex items-center justify-center space-x-1 mt-2 text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">+12%</span>
                </div>
              </div>
              <div className="bg-gray-800 p-4 text-center">
                <div className="text-2xl font-mono text-white mb-1">12,847</div>
                <div className="text-gray-400 text-xs uppercase">Global Rank</div>
                <div className="flex items-center justify-center space-x-1 mt-2 text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">+156</span>
                </div>
              </div>
              <div className="bg-gray-800 p-4 text-center">
                <div className="text-2xl font-mono text-white mb-1">163</div>
                <div className="text-gray-400 text-xs uppercase">Avg/Week</div>
                <div className="flex items-center justify-center space-x-1 mt-2 text-red-400">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs">-3%</span>
                </div>
              </div>
            </div>

            <div className="h-64">
              <div className="flex items-end justify-between h-48 space-x-2 mb-4">
                {performanceData.map((week) => (
                  <div key={week.week} className="flex-1 flex flex-col items-center group">
                    <div 
                      className="w-full bg-gray-700 hover:bg-red-600 transition-colors cursor-pointer relative"
                      style={{ height: `${(week.points / 200) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black text-white text-xs p-2 rounded">
                          {week.points} pts<br/>
                          Rank: #{week.rank.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs mt-2 font-mono">{week.week}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Driver Analysis */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
            <div className="flex items-center space-x-3 md:space-x-4 mb-6">
              <div className="w-1 h-6 bg-red-600"></div>
              <h2 className="text-lg md:text-xl font-light text-white uppercase tracking-wide">Driver Analysis</h2>
            </div>

            <div className="space-y-3">
              {driverAnalysis.map((driver) => (
                <div key={driver.name} className="bg-gray-800 p-4 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-white font-light">{driver.name}</h3>
                      <div className={`flex items-center space-x-1 ${
                        driver.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {driver.trend === 'up' ? 
                          <TrendingUp className="h-3 w-3" /> : 
                          <TrendingDown className="h-3 w-3" />
                        }
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm font-mono">{driver.owned}% owned</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-white font-mono">{driver.points}</div>
                      <div className="text-gray-500 text-xs">Total Points</div>
                    </div>
                    <div>
                      <div className="text-white font-mono">{driver.avgPoints}</div>
                      <div className="text-gray-500 text-xs">Avg/Race</div>
                    </div>
                    <div>
                      <div className="text-white font-mono">{driver.efficiency}%</div>
                      <div className="text-gray-500 text-xs">Efficiency</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="bg-gray-700 h-2 rounded">
                      <div 
                        className="bg-red-600 h-2 rounded transition-all"
                        style={{ width: `${driver.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Insights & Recommendations */}
        <div className="space-y-4 md:space-y-6">
          {/* AI Insights */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
            <div className="flex items-center space-x-3 md:space-x-4 mb-6">
              <div className="w-1 h-6 bg-red-600"></div>
              <h2 className="text-lg font-light text-white uppercase tracking-wide">Team Insights</h2>
            </div>

            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className={`bg-gray-800 p-4 border-l-4 ${
                  insight.type === 'positive' ? 'border-green-500' :
                  insight.type === 'warning' ? 'border-yellow-500' :
                  insight.type === 'negative' ? 'border-red-500' :
                  'border-gray-500'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 ${
                      insight.type === 'positive' ? 'text-green-500' :
                      insight.type === 'warning' ? 'text-yellow-500' :
                      insight.type === 'negative' ? 'text-red-500' :
                      'text-gray-500'
                    }`}>
                      {insight.type === 'positive' ? <TrendingUp className="h-4 w-4" /> :
                       insight.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                       insight.type === 'negative' ? <TrendingDown className="h-4 w-4" /> :
                       <Activity className="h-4 w-4" />}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                      <p className="text-gray-300 text-xs mt-1 leading-relaxed">{insight.description}</p>
                      <div className={`inline-block mt-2 px-2 py-1 text-xs font-mono uppercase ${
                        insight.impact === 'high' ? 'bg-red-900 text-red-300' :
                        insight.impact === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {insight.impact} impact
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
            <div className="flex items-center space-x-3 md:space-x-4 mb-6">
              <div className="w-1 h-6 bg-red-600"></div>
              <h2 className="text-lg font-light text-white uppercase tracking-wide">AI Recommendations</h2>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-mono uppercase ${
                        rec.action === 'Consider' ? 'bg-green-900 text-green-300' :
                        rec.action === 'Avoid' ? 'bg-red-900 text-red-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {rec.action}
                      </span>
                      <span className="text-white font-medium">{rec.driver}</span>
                    </div>
                    <div className="text-gray-400 text-sm font-mono">{rec.probability}%</div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">{rec.reason}</p>
                  
                  <div className="mt-3">
                    <div className="bg-gray-700 h-1 rounded">
                      <div 
                        className={`h-1 rounded transition-all ${
                          rec.action === 'Consider' ? 'bg-green-500' :
                          rec.action === 'Avoid' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${rec.probability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 p-4 md:p-6">
            <div className="flex items-center space-x-3 md:space-x-4 mb-6">
              <div className="w-1 h-6 bg-red-600"></div>
              <h2 className="text-lg font-light text-white uppercase tracking-wide">Quick Actions</h2>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard/drivers" className="block bg-gray-800 p-3 hover:bg-gray-700 transition-colors border-l-2 border-gray-700 hover:border-red-600">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-white font-mono text-sm uppercase tracking-wider">Optimize Lineup</span>
                </div>
              </Link>
              
              <button className="block w-full bg-gray-800 p-3 hover:bg-gray-700 transition-colors border-l-2 border-gray-700 hover:border-red-600">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-gray-400" />
                  <span className="text-white font-mono text-sm uppercase tracking-wider">Generate Strategy</span>
                </div>
              </button>
              
              <button className="block w-full bg-gray-800 p-3 hover:bg-gray-700 transition-colors border-l-2 border-gray-700 hover:border-red-600">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <span className="text-white font-mono text-sm uppercase tracking-wider">Export Report</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
