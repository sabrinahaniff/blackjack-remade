import { useState } from 'react';
import { useBlackjack } from './hooks/useBlackjack.js';
import Hand from './components/Hand.jsx';
import Chips from './components/Chips.jsx';
import HUD from './components/HUD.jsx';

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#064e3b',
    backgroundImage: `radial-gradient(ellipse at center, #065f46 0%, #022c22 100%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    gap: '32px',
  },
  title: {
    color: '#fbbf24',
    fontFamily: 'Georgia, serif',
    fontSize: '42px',
    fontWeight: 'bold',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
    margin: 0,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '24px',
    padding: '32px 48px',
    border: '2px solid rgba(255,255,255,0.1)',
    minWidth: '480px',
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
  },
  bust: {
    color: '#f87171',
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    letterSpacing: '0.1em',
  },
};

export default function App() {
  const [bet, setBet] = useState(0);
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

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Blackjack</h1>

      <div style={styles.table}>

        {/* dealer side */}
        {dealerHand.length > 0 && (
          <Hand
            hand={dealerHand}
            label={`Dealer${!dealerHidden ? ` — ${dealerTotal}` : ''}`}
            dealerHidden={dealerHidden}
          />
        )}

        {dealerHand.length > 0 && playerHand.length > 0 && (
          <div style={styles.divider} />
        )}

        {/* player side */}
        {playerHand.length > 0 && (
          <Hand
            hand={playerHand}
            label={`You - ${playerTotal}`}
          />
        )}

        {/* betting phase */}
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

        {/* actions + result */}
        {phase !== 'betting' && (
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
        )}

      </div>
    </div>
  );
}