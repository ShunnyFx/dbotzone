'use client';

import React from 'react';
import { JokeGenerator } from '@components/JokeGenerator';
import { Layout } from '@components/Layout';

export default function JokePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <JokeGenerator />
      </div>
    </Layout>
  );
}