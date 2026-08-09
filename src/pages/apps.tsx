'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@components/Layout';

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  path: string;
  status: 'active' | 'coming-soon';
  color: string;
}

const APPS: App[] = [
  {
    id: 'trading',
    name: 'Trading Dashboard',
    description: 'Binary options trading platform with real-time charts and analytics',
    category: 'Finance',
    icon: '📈',
    path: '/dashboard',
    status: 'active',
    color: 'from-blue-600 to-blue-700',
  },
  {
    id: 'portfolio',
    name: 'Portfolio Manager',
    description: 'Manage your trades, track performance, and analyze statistics',
    category: 'Finance',
    icon: '💼',
    path: '/portfolio',
    status: 'active',
    color: 'from-purple-600 to-purple-700',
  },
  {
    id: 'markets',
    name: 'Markets Explorer',
    description: 'Browse available assets and market data across all categories',
    category: 'Finance',
    icon: '🌐',
    path: '/markets',
    status: 'active',
    color: 'from-green-600 to-green-700',
  },
  {
    id: 'jokes',
    name: 'Joke Generator',
    description: 'Get random jokes powered by JokeAPI - Single and two-part jokes',
    category: 'Entertainment',
    icon: '🤣',
    path: '/jokes',
    status: 'active',
    color: 'from-yellow-600 to-yellow-700',
  },
  {
    id: 'api-tools',
    name: 'API Tools Hub',
    description: 'Collection of external API integrations - Jokes, Cats, Dogs, Users',
    category: 'Tools',
    icon: '🔧',
    path: '/api-tools',
    status: 'active',
    color: 'from-orange-600 to-orange-700',
  },
  {
    id: 'chat',
    name: 'AI Chat Assistant',
    description: 'Chat with AI powered by OpenAI GPT model',
    category: 'AI',
    icon: '🤖',
    path: '/chat',
    status: 'coming-soon',
    color: 'from-cyan-600 to-cyan-700',
  },
  {
    id: 'crypto',
    name: 'Crypto Tracker',
    description: 'Real-time cryptocurrency prices and portfolio tracking',
    category: 'Finance',
    icon: '₿',
    path: '/crypto',
    status: 'coming-soon',
    color: 'from-amber-600 to-amber-700',
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Deep analytics and backtesting for trading strategies',
    category: 'Finance',
    icon: '📊',
    path: '/analytics',
    status: 'coming-soon',
    color: 'from-pink-600 to-pink-700',
  },
  {
    id: 'weather',
    name: 'Weather App',
    description: 'Real-time weather data with forecasts',
    category: 'Tools',
    icon: '🌤️',
    path: '/weather',
    status: 'coming-soon',
    color: 'from-sky-600 to-sky-700',
  },
  {
    id: 'news',
    name: 'News Reader',
    description: 'Stay updated with latest news from top sources',
    category: 'Information',
    icon: '📰',
    path: '/news',
    status: 'coming-soon',
    color: 'from-slate-600 to-slate-700',
  },
];

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredApps, setFilteredApps] = useState(APPS);

  useEffect(() => {
    let filtered = APPS;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((app) => app.category === selectedCategory);
    }

    setFilteredApps(filtered);
  }, [searchQuery, selectedCategory]);

  const categories = [...new Set(APPS.map((app) => app.category))];
  const activeAppsCount = APPS.filter((app) => app.status === 'active').length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">🚀 DBotZone Apps</h1>
            <p className="text-gray-400 text-xl mb-6">
              Discover and launch your favorite applications
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <p className="text-gray-400 text-sm">Total Apps</p>
                <p className="text-3xl font-bold text-white">{APPS.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <p className="text-gray-400 text-sm">Active Apps</p>
                <p className="text-3xl font-bold text-green-400">{activeAppsCount}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <p className="text-gray-400 text-sm">Coming Soon</p>
                <p className="text-3xl font-bold text-yellow-400">{APPS.length - activeAppsCount}</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-4 top-3 text-gray-400">🔍</span>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Apps Grid */}
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className={`bg-gradient-to-br ${app.color} rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition transform hover:scale-105 cursor-pointer group`}
                  onClick={() => {
                    if (app.status === 'active') {
                      window.location.href = app.path;
                    }
                  }}
                >
                  {/* Card Content */}
                  <div className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 text-8xl opacity-10 group-hover:opacity-20 transition">
                      {app.icon}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-5xl mb-4">{app.icon}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{app.name}</h3>
                      <p className="text-white/80 text-sm mb-4">{app.description}</p>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/20">
                      <span className="text-xs font-semibold text-white/70 uppercase">
                        {app.category}
                      </span>
                      {app.status === 'active' ? (
                        <span className="px-3 py-1 bg-green-400/20 text-green-300 rounded-full text-xs font-bold">
                          🟢 Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold">
                          ⏱️ Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No apps found matching your search</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* App Development Guide */}
          <div className="mt-16 bg-white/10 backdrop-blur rounded-lg border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">📱 App Development Guide</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-4">✨ Active Apps</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Trading Dashboard - Real-time portfolio management</li>
                  <li>✓ Portfolio Manager - Trade history & analytics</li>
                  <li>✓ Markets Explorer - Asset browsing</li>
                  <li>✓ Joke Generator - Entertainment API integration</li>
                  <li>✓ API Tools Hub - Multi-API playground</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">🔮 Coming Soon</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>🤖 AI Chat Assistant - GPT-powered conversations</li>
                  <li>₿ Crypto Tracker - Real-time price tracking</li>
                  <li>📊 Advanced Analytics - Strategy backtesting</li>
                  <li>🌤️ Weather App - Real-time forecasts</li>
                  <li>📰 News Reader - Latest market news</li>
                </ul>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">🛠️ Technology Stack</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                <div>
                  <p className="font-semibold text-blue-400">Frontend</p>
                  <p>React 18 + Next.js 14</p>
                </div>
                <div>
                  <p className="font-semibold text-green-400">Backend</p>
                  <p>Express.js + Node.js</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-400">State</p>
                  <p>Zustand + Axios</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-400">UI</p>
                  <p>Tailwind CSS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
