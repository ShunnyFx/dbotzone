'use client';

import React, { useState, useEffect } from 'react';
import { externalApiService } from '@services/externalApiService';

interface DogImage {
  message: string;
  status: string;
}

export const DogImageGenerator: React.FC = () => {
  const [dogImage, setDogImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState(0);

  const fetchDogImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await externalApiService.getRandomDogImage();
      if (data.status === 'success') {
        setDogImage(data.message);
        setImageCount((prev) => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dog image');
      setDogImage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg shadow-xl p-8 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🐕 Dog Image Generator</h1>
          <p className="text-amber-100">Get random adorable dog images!</p>
        </div>

        {/* Image Display */}
        <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-6 min-h-96 flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading dog image...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-200">❌ {error}</p>
            </div>
          ) : dogImage ? (
            <img
              src={dogImage}
              alt="Random dog"
              className="max-w-full max-h-96 rounded-lg shadow-lg"
            />
          ) : (
            <p className="text-center text-amber-100">Click the button to see a dog!</p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={fetchDogImage}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 text-amber-600 active:bg-yellow-600'
          }`}
        >
          {loading ? 'Loading...' : '🎲 Get Random Dog Image'}
        </button>

        {/* Counter */}
        {imageCount > 0 && (
          <div className="mt-6 text-center text-amber-100">
            <p>You've viewed <span className="font-bold text-yellow-300">{imageCount}</span> adorable dogs!</p>
          </div>
        )}
      </div>
    </div>
  );
};