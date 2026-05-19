import { useState } from 'react';
import { getHint } from '../lib/basicStrategy.js';
import { getResultMessage } from '../lib/gameLogic.js';

const HINT_LABELS = {
  H: { label: 'Hit',         color: '#ef4444' },
  S: { label: 'Stand',       color: '#3b82f6' },
  D: { label: 'Double Down', color: '#f59e0b' },
  P: { label: 'Split',       color: '#a855f7' },
};

function ActionBtn({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: color, border: 'none', color: '#fff',
        borderRadius: '8px', padding: '12px 28px',
        cursor: 'pointer', fontFamily: '"Cinzel", Georgia, serif',
        fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.05em',
        boxShadow: '0 3px 0 rgba(0,0,0,0.3)', transition: 'transform 0.1s, box-shadow 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      onMouseDown={e => { e.currentTarget.style.transform = 'translateY(2px)'; }}
    >
      {label}
    </button>
  );
}

export default function HUD({
  phase, result, splitResult,
  playerHand, dealerHand, dealerHidden,
  bankroll, bet, canSplit, showInsurance,
  onHit, onStand, onDouble, onSplit, onNext, onInsurance,
}) {
  const [showHint, setShowHint] = useState(false);

  const hint = playerHand.length >= 2 && dealerHand.length >= 1
    ? getHint(playerHand, dealerHand[0])
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"EB Garamond", Georgia, serif', fontSize: '14px' }}>
        Bankroll: <strong style={{ color: '#fbbf24' }}>${bankroll}</strong>
        &nbsp;|&nbsp;
        Bet: <strong style={{ color: '#fbbf24' }}>${bet}</strong>
      </span>

      {/* insurance offer */}
      {phase === 'insurance' && (
        <div className="slide-up" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: '12px', padding: '16px 24px', textAlign: 'center',
        }}>
          <span style={{ color: '#fbbf24', fontFamily: '"Cinzel", Georgia, serif', fontSize: '15px', fontWeight: 'bold' }}>
            Dealer shows an Ace
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"EB Garamond", Georgia, serif', fontSize: '13px' }}>
            Take insurance for ${Math.floor(bet / 2)}? Pays 2:1 if dealer has blackjack.
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <ActionBtn label="Take Insurance" color="#f59e0b" onClick={() => onInsurance(true)} />
            <ActionBtn label="No Thanks" color="#6b7280" onClick={() => onInsurance(false)} />
          </div>
        </div>
      )}

      {/* player actions */}
      {phase === 'player' && (
        <>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <ActionBtn label="Hit"    color="#ef4444" onClick={onHit} />
            <ActionBtn label="Stand"  color="#3b82f6" onClick={onStand} />
            {playerHand.length === 2 && bankroll >= bet && (
              <ActionBtn label="Double" color="#f59e0b" onClick={onDouble} />
            )}
            {canSplit && (
              <ActionBtn label="Split" color="#a855f7" onClick={onSplit} />
            )}
          </div>

          <button
            onClick={() => setShowHint(p => !p)}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.45)', borderRadius: '6px', padding: '5px 14px',
              cursor: 'pointer', fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '13px', fontStyle: 'italic',
            }}
          >
            {showHint ? 'Hide hint' : '💡 Basic strategy hint'}
          </button>

          {showHint && hint && (
            <div className="slide-up" style={{
              background: 'rgba(0,0,0,0.35)',
              border: `1px solid ${HINT_LABELS[hint].color}`,
              borderRadius: '8px', padding: '8px 20px',
              color: HINT_LABELS[hint].color,
              fontFamily: '"EB Garamond", Georgia, serif', fontSize: '15px',
            }}>
              Basic strategy says: <strong>{HINT_LABELS[hint].label}</strong>
            </div>
          )}
        </>
      )}

      {/* result */}
      {phase === 'result' && (
        <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          {splitResult ? (
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              {[['HAND 1', result], ['HAND 2', splitResult]].map(([label, res]) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: '"Cinzel", serif', letterSpacing: '0.1em' }}>
                    {label}
                  </span>
                  <div className="result-pop" style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: `1px solid ${['win','blackjack'].includes(res) ? '#4ade80' : res === 'push' ? '#fbbf24' : '#f87171'}`,
                    borderRadius: '8px', padding: '4px 16px',
                    color: ['win','blackjack'].includes(res) ? '#4ade80' : res === 'push' ? '#fbbf24' : '#f87171',
                    fontFamily: '"Cinzel", serif', fontSize: '14px', fontWeight: 'bold',
                  }}>
                    {res === 'blackjack' ? 'BJ!' : res.charAt(0).toUpperCase() + res.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="result-pop" style={{
              fontSize: '28px', fontWeight: 'bold',
              fontFamily: '"Cinzel", Georgia, serif',
              color: ['win','blackjack'].includes(result) ? '#4ade80' : result === 'push' ? '#fbbf24' : '#f87171',
              textAlign: 'center', letterSpacing: '0.05em',
            }}>
              {getResultMessage(result)}
            </div>
          )}

          <button
            onClick={onNext}
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              border: '2px solid #14532d', color: '#fff',
              borderRadius: '10px', padding: '12px 40px',
              cursor: 'pointer', fontFamily: '"Cinzel", Georgia, serif',
              fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.1em',
              boxShadow: '0 4px 0 #14532d',
            }}
          >
            Next Hand
          </button>
        </div>
      )}
    </div>
  );
}