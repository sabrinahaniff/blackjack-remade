import { useState, useEffect, useCallback } from 'react';
import { useBlackjack } from './hooks/useBlackjack.js';
import { useStats } from './hooks/useStats.js';
import Hand from './components/Hand.jsx';
import Chips from './components/Chips.jsx';
import HUD from './components/HUD.jsx';
import Stats from './components/Stats.jsx';
import Confetti from './components/Confetti.jsx';

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#022c22',
    backgroundImage: `
      radial-gradient(ellipse at 50% 0%, #065f46 0%, #022c22 60%),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 40px,
        rgba(255,255,255,0.01) 40px,
        rgba(255,255,255,0.01) 80px
      )
    `,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '32px 24px 48px',
    gap: '24px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  title: {
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: '52px',
    fontWeight: '900',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    margin: 0,
    lineHeight: 1,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.3)',
    fontFamily: '"EB Garamond", Georgia, serif',
    fontSize: '13px',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
    background: 'rgba(0,0,0,0.25)',
    borderRadius: '32px',
    padding: '36px 52px',
    border: '1px solid rgba(255,255,255,0.07)',
    minWidth: '520px',
    maxWidth: '680px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  tableRing: {
    position: 'absolute',
    inset: '-3px',
    borderRadius: '34px',
    border: '1px solid rgba(251,191,36,0.15)',
    pointerEvents: 'none',
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
  },
  dealerThinking: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: '"EB Garamond", Georgia, serif',
    fontSize: '14px',
    fontStyle: 'italic',
    letterSpacing: '0.05em',
  },
  keyboardHints: {
    display: 'flex',
    gap: '16px',
    marginTop: '4px',
  },
  keyHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255,255,255,0.25)',
    fontSize: '11px',
    fontFamily: '"EB Garamond", Georgia, serif',
  },
  key: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '4px',
    padding: '1px 6px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: 'rgba(255,255,255,0.4)',
  },
};

export default function App() {
  const [bet, setBet] = useState(0);
  const { stats, winRate, recordResult, resetStats } = useStats();
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    playerHand,
    dealerHand,
    dealerHidden,
    bankroll,
    bet: activeBet,
    phase,
    result,
    playerTotal,
    dealerTotal,
    startGame,
    hit,
    stand,
    doubleDown,
    resetGame,
  } = useBlackjack();

  // record result and trigger confetti
  useEffect(() => {
    if (result) {
      recordResult(result, activeBet);
      if (result === 'win' || result === 'blackjack') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [result]);

  // keyboard shortcuts
  const handleKey = useCallback((e) => {
    if (phase !== 'player') return;
    if (e.key === 'h' || e.key === 'H') hit();
    if (e.key === 's' || e.key === 'S') stand();
    if (e.key === 'd' || e.key === 'D') {
      if (playerHand.length === 2 && bankroll >= activeBet) doubleDown();
    }
  }, [phase, hit, stand, doubleDown, playerHand, bankroll, activeBet]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div style={styles.app}>
      <Confetti active={showConfetti} />

      <div style={styles.header}>
        <h1 style={styles.title} className="gold-shimmer">Blackjack</h1>
        <span style={styles.subtitle}>Las Vegas Rules</span>
      </div>

      <Stats stats={stats} winRate={winRate} onReset={resetStats} />

      <div style={styles.table}>
        <div style={styles.tableRing} />

        {/* dealer */}
        {dealerHand.length > 0 && (
          <Hand
            hand={dealerHand}
            label={
              phase === 'dealer'
                ? `Dealer is thinking...`
                : dealerHand.length > 0 && !dealerHidden
                ? `Dealer — ${dealerTotal}`
                : 'Dealer'
            }
            dealerHidden={dealerHidden}
            isThinking={phase === 'dealer'}
          />
        )}

        {dealerHand.length > 0 && playerHand.length > 0 && (
          <div style={styles.divider} />
        )}

        {/* player */}
        {playerHand.length > 0 && (
          <Hand
            hand={playerHand}
            label={`You — ${playerTotal}`}
          />
        )}

        {/* betting */}
        {phase === 'betting' && (
          <Chips
            bet={bet}
            setBet={setBet}
            bankroll={bankroll}
            onDeal={(amount) => {
              startGame(amount);
              setBet(0);
            }}
          />
        )}

        {/* actions */}
        {phase !== 'betting' && (
          <>
            <HUD
              phase={phase}
              result={result}
              playerHand={playerHand}
              dealerHand={dealerHand}
              dealerHidden={dealerHidden}
              bankroll={bankroll}
              bet={activeBet}
              onHit={hit}
              onStand={stand}
              onDouble={doubleDown}
              onNext={resetGame}
            />

            {phase === 'player' && (
              <div style={styles.keyboardHints}>
                <div style={styles.keyHint}>
                  <span style={styles.key}>H</span> Hit
                </div>
                <div style={styles.keyHint}>
                  <span style={styles.key}>S</span> Stand
                </div>
                <div style={styles.keyHint}>
                  <span style={styles.key}>D</span> Double
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}