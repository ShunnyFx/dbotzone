'use client';

import React from 'react';
import { JokeGenerator } from '@components/JokeGenerator';
import { CatFactGenerator } from '@components/CatFactGenerator';
import { DogImageGenerator } from '@components/DogImageGenerator';
import { RandomUserGenerator } from '@components/RandomUserGenerator';
import { Layout } from '@components/Layout';

export default function ApiToolsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">🔧 API Tools Hub</h1>
            <p className="text-gray-400 text-xl">Explore various external APIs integrated into DBotZone</p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Joke Generator */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <JokeGenerator />
            </div>

            {/* Cat Facts Generator */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <CatFactGenerator />
            </div>

            {/* Dog Image Generator */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <DogImageGenerator />
            </div>

            {/* Random User Generator */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <RandomUserGenerator />
            </div>
          </div>

          {/* API Information */}
          <div className="bg-white/10 backdrop-blur rounded-lg border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">📡 Integrated APIs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-blue-400 mb-2">🤣 JokeAPI</h3>
                <p className="text-gray-300 text-sm mb-2">Random jokes with setup/delivery format</p>
                <a href="https://jokeapi.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  Visit API →
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-orange-400 mb-2">🐱 Cat Facts API</h3>
                <p className="text-gray-300 text-sm mb-2">Amazing facts about cats</p>
                <a href="https://catfact.ninja" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  Visit API →
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-amber-400 mb-2">🐕 Dog API</h3>
                <p className="text-gray-300 text-sm mb-2">Random dog images and breed info</p>
                <a href="https://dog.ceo/api" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  Visit API →
                </a>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-green-400 mb-2">👤 Random User API</h3>
                <p className="text-gray-300 text-sm mb-2">Generate random user profiles</p>
                <a href="https://randomuser.me" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  Visit API →
                </a>
              </div>
            </div>

            {/* Additional APIs */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">🔌 Other Available APIs</h3>
              <div className="space-y-2 text-gray-300">
                <p>• <span className="text-blue-400">Weather API</span> - Open-Meteo (Free weather data)</p>
                <p>• <span className="text-blue-400">Countries API</span> - REST Countries (Country information)</p>
                <p>• <span className="text-blue-400">Stock API</span> - Alpha Vantage (Stock market data)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}