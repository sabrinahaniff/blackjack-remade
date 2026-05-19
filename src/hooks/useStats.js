import { useState, useEffect, useCallback } from 'react';

const DEFAULT_STATS = {
  handsPlayed: 0,
  wins: 0,
  losses: 0,
  pushes: 0,
  blackjacks: 0,
  biggestWin: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export function useStats() {
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('bj-stats');
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  useEffect(() => {
    localStorage.setItem('bj-stats', JSON.stringify(stats));
  }, [stats]);

  const recordResult = useCallback((result, betAmount) => {
    setStats(prev => {
      const isWin = result === 'win' || result === 'blackjack';
      const isLoss = result === 'bust' || result === 'lose';
      const isPush = result === 'push';
      const isBJ = result === 'blackjack';

      const payout = isWin
        ? isBJ ? betAmount * 1.5 : betAmount
        : 0;

      const newStreak = isWin
        ? prev.currentStreak + 1
        : isLoss ? 0
        : prev.currentStreak;

      return {
        handsPlayed: prev.handsPlayed + 1,
        wins: prev.wins + (isWin ? 1 : 0),
        losses: prev.losses + (isLoss ? 1 : 0),
        pushes: prev.pushes + (isPush ? 1 : 0),
        blackjacks: prev.blackjacks + (isBJ ? 1 : 0),
        biggestWin: Math.max(prev.biggestWin, payout),
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem('bj-stats');
  }, []);

  const winRate = stats.handsPlayed > 0
    ? Math.round((stats.wins / stats.handsPlayed) * 100)
    : 0;

  return { stats, winRate, recordResult, resetStats };
}