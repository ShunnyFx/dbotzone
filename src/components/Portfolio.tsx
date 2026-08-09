'use client';

import React, { useEffect, useState } from 'react';
import { Trade, TradeStatistics } from '@types/index';
import { useTradingStore } from '@store/tradingStore';
import { calculateTradeStatistics } from '@utils/calculations';

export const Portfolio: React.FC = () => {
  const trades = useTradingStore((state) => state.trades);
  const portfolio = useTradingStore((state) => state.portfolio);
  const [stats, setStats] = useState<TradeStatistics | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  useEffect(() => {
    const calculatedStats = calculateTradeStatistics(trades);
    setStats(calculatedStats);
  }, [trades]);

  const getFilteredTrades = (): Trade[] => {
    switch (filter) {
      case 'open':
        return trades.filter((t) => t.status === 'open' || t.status === 'pending');
      case 'closed':
        return trades.filter((t) => t.status === 'closed' || t.status === 'expired');
      default:
        return trades;
    }
  };

  const filteredTrades = getFilteredTrades();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-gray-400">Your trading history and performance</p>
        </div>

        {/* Statistics Summary */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-gray-400 text-xs mb-2">Total Trades</p>
              <p className="text-2xl font-bold text-white">{stats.totalTrades}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-gray-400 text-xs mb-2">Win Rate</p>
              <p className="text-2xl font-bold text-green-400">{stats.winRate.toFixed(2)}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-gray-400 text-xs mb-2">Profit Factor</p>
              <p className="text-2xl font-bold text-blue-400">{stats.profitFactor.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-gray-400 text-xs mb-2">Total Profit</p>
              <p
                className={`text-2xl font-bold ${
                  stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                ${stats.totalProfit.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            All Trades ({trades.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'open'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Open (
            {trades.filter((t) => t.status === 'open' || t.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'closed'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Closed (
            {trades.filter((t) => t.status === 'closed' || t.status === 'expired').length})
          </button>
        </div>

        {/* Trades Table */}
        {filteredTrades.length > 0 ? (
          <div className="bg-white/10 backdrop-blur rounded-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/20">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Asset</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Type</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Entry</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Exit</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Amount</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">P&L</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Return %</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-4 px-6 text-white font-semibold">{trade.asset.symbol}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            trade.type === 'call'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white">${trade.entryPrice.toFixed(4)}</td>
                      <td className="py-4 px-6 text-white">
                        {trade.exitPrice ? `$${trade.exitPrice.toFixed(4)}` : '-'}
                      </td>
                      <td className="py-4 px-6 text-white">${trade.amount.toFixed(2)}</td>
                      <td
                        className={`py-4 px-6 font-semibold ${
                          (trade.profit ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        ${(trade.profit ?? 0).toFixed(2)}
                      </td>
                      <td
                        className={`py-4 px-6 font-semibold ${
                          (trade.profitPercentage ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {(trade.profitPercentage ?? 0).toFixed(2)}%
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            trade.status === 'open'
                              ? 'bg-blue-500/20 text-blue-400'
                              : trade.status === 'closed'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {trade.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm">
                        {trade.entryTime.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur rounded-lg p-12 border border-white/20 text-center">
            <p className="text-gray-400">No trades found</p>
          </div>
        )}
      </div>
    </div>
  );
};
