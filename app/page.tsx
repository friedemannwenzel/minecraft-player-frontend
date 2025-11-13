'use client';

import { useEffect, useState } from 'react';

interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  motd?: string;
  error?: string;
}

export default function Home() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchServerStatus = async () => {
    try {
      const response = await fetch('/api/server-status');
      const data = await response.json();
      setStatus(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching server status:', error);
      setStatus({
        online: false,
        error: 'Failed to fetch server status',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center gap-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Minecraft Server Status
          </h1>
        </div>

        <div className="w-full max-w-md">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading server status...</p>
            </div>
          ) : status?.online ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Server Online
                </span>
              </div>
              
              <div className="mb-6">
                <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                  {status.players?.online ?? 0}
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-400">
                  / {status.players?.max ?? 0} players
                </div>
              </div>

              {status.version && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Version: {status.version}
                </div>
              )}

              {lastUpdate && (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                  Server Offline
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {status?.error || 'Unable to connect to server'}
              </p>
              {lastUpdate && (
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                  Last checked: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={fetchServerStatus}
          disabled={loading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </main>
    </div>
  );
}
