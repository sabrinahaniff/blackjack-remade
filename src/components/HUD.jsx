import { getHint } from '../lib/basicStrategy.js';
import { getResultMessage } from '../lib/gameLogic.js';
import { useState } from 'react';

const HINT_LABELS = {
  H: { label: 'Hit', color: '#ef4444' },
  S: { label: 'Stand', color: '#3b82f6' },
  D: { label: 'Double Down', color: '#f59e0b' },
  P: { label: 'Split', color: '#8b5cf6' },
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btn: (color) => ({
    background: color,
    border: 'none',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 28px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    transition: 'opacity 0.15s',
  }),
  hintBox: (color) => ({
    background: 'rgba(0,0,0,0.3)',
    border: `1px solid ${color}`,
    borderRadius: '8px',
    padding: '8px 20px',
    color: color,
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    textAlign: 'center',
  }),
  hintBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'rgba(255,255,255,0.6)',
    borderRadius: '6px',
    padding: '6px 16px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
  },
  resultBanner: (result) => ({
    fontSize: '26px',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
    color: ['win', 'blackjack'].includes(result) ? '#4ade80'
         : result === 'push' ? '#fbbf24'
         : '#f87171',
    textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  }),
  nextBtn: {
    background: '#16a34a',
    border: '2px solid #14532d',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 36px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  bankroll: {
    color: '#fbbf24',
    fontFamily: 'Georgia, serif',
    fontSize: '16px',
  },
};

export default function HUD({
  phase,
  result,
  playerHand,
  dealerHand,
  dealerHidden,
  bankroll,
  bet,
  onHit,
  onStand,
  onDouble,
  onNext,
}) {
  const [showHint, setShowHint] = useState(false);

  const hint = playerHand.length >= 2 && dealerHand.length >= 1
    ? getHint(playerHand, dealerHand[0])
    : null;

  return (
    <div style={styles.container}>
      <span style={styles.bankroll}>
        Bankroll: ${bankroll} &nbsp;|&nbsp; Bet: ${bet}
      </span>

      {phase === 'player' && (
        <>
          <div style={styles.actions}>
            <button
              style={styles.btn('#ef4444')}
              onClick={onHit}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Hit
            </button>
            <button
              style={styles.btn('#3b82f6')}
              onClick={onStand}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Stand
            </button>
            {playerHand.length === 2 && bankroll >= bet && (
              <button
                style={styles.btn('#f59e0b')}
                onClick={onDouble}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Double
              </button>
            )}
          </div>

          <button style={styles.hintBtn} onClick={() => setShowHint(p => !p)}>
            {showHint ? 'Hide hint' : '💡 Basic strategy hint'}
          </button>

          {showHint && hint && (
            <div style={styles.hintBox(HINT_LABELS[hint].color)}>
              Basic strategy says: <strong>{HINT_LABELS[hint].label}</strong>
            </div>
          )}
        </>
      )}

      {phase === 'result' && result && (
        <>
          <div style={styles.resultBanner(result)}>
            {getResultMessage(result)}
          </div>
          <button style={styles.nextBtn} onClick={onNext}>
            Next Hand
          </button>
        </>
      )}
    </div>
  );
}