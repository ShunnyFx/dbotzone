'use client';

import React, { useState } from 'react';
import { externalApiService } from '@services/externalApiService';

interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  picture: {
    large: string;
  };
  location: {
    country: string;
    city: string;
  };
}

export const RandomUserGenerator: React.FC = () => {
  const [user, setUser] = useState<RandomUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);

  const fetchRandomUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await externalApiService.getRandomUser();
      setUser(data);
      setUserCount((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch random user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-xl p-8 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">👤 Random User Generator</h1>
          <p className="text-green-100">Generate random user profiles!</p>
        </div>

        {/* User Display */}
        <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading random user...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-200">❌ {error}</p>
            </div>
          ) : user ? (
            <div className="text-center">
              <img
                src={user.picture.large}
                alt={user.name.first}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/30"
              />
              <h2 className="text-2xl font-bold mb-2">
                {user.name.first} {user.name.last}
              </h2>
              <p className="text-green-100 mb-1">📧 {user.email}</p>
              <p className="text-green-100 mb-1">📞 {user.phone}</p>
              <p className="text-green-100">📍 {user.location.city}, {user.location.country}</p>
            </div>
          ) : (
            <p className="text-center text-green-100 py-12">Click the button to generate a random user!</p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={fetchRandomUser}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 text-green-600 active:bg-yellow-600'
          }`}
        >
          {loading ? 'Loading...' : '🎲 Generate Random User'}
        </button>

        {/* Counter */}
        {userCount > 0 && (
          <div className="mt-6 text-center text-green-100">
            <p>You've generated <span className="font-bold text-yellow-300">{userCount}</span> random users!</p>
          </div>
        )}
      </div>
    </div>
  );
};
