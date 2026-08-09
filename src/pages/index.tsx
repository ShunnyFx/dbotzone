'use client';

import React from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">DBotZone</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
