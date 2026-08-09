'use client';

import React, { useState } from 'react';

interface Joke {
  id: string;
  type: string;
  setup?: string;
  delivery?: string;
  joke?: string;
}

export const JokeGenerator: React.FC = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jokeCount, setJokeCount] = useState(0);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);

    try {
      // Using JokeAPI - https://jokeapi.dev
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?format=json');

      if (!response.ok) {
        throw new Error('Failed to fetch joke');
      }

      const data: Joke = await response.json();
      setJoke(data);
      setJokeCount((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setJoke(null);
    } finally {
      setLoading(false);
    }
  };

  const getJokeText = (): string => {
    if (!joke) return '';
    if (joke.type === 'single') {
      return joke.joke || '';
    } else {
      return `${joke.setup}\n\n${joke.delivery}`;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-xl p-8 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">😂 Joke Generator</h1>
          <p className="text-blue-100">Get a random joke powered by JokeAPI</p>
        </div>

        {/* Joke Display */}
        <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-6 min-h-32 flex items-center">
          {loading ? (
            <div className="w-full text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading joke...</p>
            </div>
          ) : error ? (
            <div className="w-full text-center">
              <p className="text-red-200">❌ {error}</p>
            </div>
          ) : joke ? (
            <div className="w-full">
              {joke.type === 'single' ? (
                <p className="text-lg text-center leading-relaxed">{joke.joke}</p>
              ) : (
                <div>
                  <p className="text-lg mb-4">{joke.setup}</p>
                  <p className="text-lg font-semibold text-yellow-200">{joke.delivery}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="w-full text-center text-blue-100">Click the button below to get a joke!</p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={fetchJoke}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 text-blue-600 active:bg-yellow-600'
          }`}
        >
          {loading ? 'Loading...' : '🎲 Get Random Joke'}
        </button>

        {/* Counter */}
        {jokeCount > 0 && (
          <div className="mt-6 text-center text-blue-100">
            <p>You've generated <span className="font-bold text-yellow-300">{jokeCount}</span> jokes!</p>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm text-blue-100">
          <p>Powered by <a href="https://jokeapi.dev" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:underline">JokeAPI</a></p>
        </div>
      </div>
    </div>
  );
};