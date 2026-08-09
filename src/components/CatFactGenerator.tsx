'use client';

import React, { useState } from 'react';
import { externalApiService } from '@services/externalApiService';

interface CatFact {
  fact: string;
  length: number;
}

export const CatFactGenerator: React.FC = () => {
  const [fact, setFact] = useState<CatFact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factCount, setFactCount] = useState(0);

  const fetchCatFact = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await externalApiService.getRandomCatFact();
      setFact(data);
      setFactCount((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cat fact');
      setFact(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg shadow-xl p-8 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🐱 Cat Facts Generator</h1>
          <p className="text-orange-100">Learn amazing facts about cats!</p>
        </div>

        {/* Fact Display */}
        <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-6 min-h-32 flex items-center">
          {loading ? (
            <div className="w-full text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading cat fact...</p>
            </div>
          ) : error ? (
            <div className="w-full text-center">
              <p className="text-red-200">❌ {error}</p>
            </div>
          ) : fact ? (
            <p className="text-lg text-center leading-relaxed">{fact.fact}</p>
          ) : (
            <p className="w-full text-center text-orange-100">Click the button to learn a cat fact!</p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={fetchCatFact}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 text-orange-600 active:bg-yellow-600'
          }`}
        >
          {loading ? 'Loading...' : '🎲 Get Random Cat Fact'}
        </button>

        {/* Counter */}
        {factCount > 0 && (
          <div className="mt-6 text-center text-orange-100">
            <p>You've learned <span className="font-bold text-yellow-300">{factCount}</span> cat facts!</p>
          </div>
        )}
      </div>
    </div>
  );
};