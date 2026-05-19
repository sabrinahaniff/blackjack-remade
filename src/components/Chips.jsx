import { useState } from 'react';
import { sounds } from '../lib/sounds.js';

const CHIP_VALUES = [2, 5, 25, 100, 500];

const CHIP_COLORS = {
  2:   { bg: '#dc2626', border: '#7f1d1d', text: '#fff' },
  5:   { bg: '#d97706', border: '#78350f', text: '#fff' },
  25:  { bg: '#16a34a', border: '#14532d', text: '#fff' },
  100: { bg: '#1d4ed8', border: '#1e3a8a', text: '#fff' },
  500: { bg: '#7c3aed', border: '#4c1d95', text: '#fff' },
};

function ChipCircle({ value, size = 56, onClick }) {
  const c = CHIP_COLORS[value];
  return (
    <div
      onClick={onClick}
      style={{
        width: `${size}px`, height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: c.bg,
        border: `4px dashed ${c.border}`,
        color: c.text,
        fontSize: size > 40 ? '13px' : '11px',
        fontWeight: 'bold',
        fontFamily: '"Cinzel", Georgia, serif',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        userSelect: 'none', flexShrink: 0,
        transition: 'transform 0.15s',
        boxShadow: `0 3px 0 ${c.border}`,
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = 'scale(1.12) translateY(-4px)'; }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.transform = 'scale(1)'; }}
    >
      ${value}
    </div>
  );
}

export default function Chips({ bet, setBet, bankroll, onDeal, lastBet }) {
  const [chipStack, setChipStack] = useState([]);

  const addChip = (value) => {
    if (bet + value > bankroll) return;
    if (bet + value > 500) return;
    sounds.chip();
    setBet(prev => prev + value);
    setChipStack(prev => [...prev, { value, id: Date.now() + Math.random() }]);
  };

  const clearBet = () => {
    setBet(0);
    setChipStack([]);
  };

  const useLastBet = () => {
    if (!lastBet || lastBet > bankroll) return;
    clearBet();
    // decompose lastBet into chips greedily
    let remaining = lastBet;
    const newStack = [];
    for (const v of [500, 100, 25, 5, 2]) {
      while (remaining >= v) {
        newStack.push({ value: v, id: Date.now() + Math.random() });
        remaining -= v;
        sounds.chip();
      }
    }
    setBet(lastBet);
    setChipStack(newStack);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <span style={{
        color: 'rgba(255,255,255,0.4)', fontSize: '12px',
        fontFamily: '"Cinzel", Georgia, serif',
        letterSpacing: '0.15em', textTransform: 'uppercase',
      }}>
        Place Your Bet
      </span>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {CHIP_VALUES.map(value => (
          <ChipCircle key={value} value={value} onClick={() => addChip(value)} />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', minHeight: '80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '56px' }}>
          {chipStack.length === 0 ? (
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              border: '2px dashed rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>bet</span>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '56px', height: `${Math.min(chipStack.length * 14 + 42, 120)}px` }}>
              {chipStack.map((chip, i) => (
                <div key={chip.id} className="chip-bounce" style={{ position: 'absolute', bottom: `${i * 10}px`, left: 0 }}>
                  <ChipCircle value={chip.value} size={48} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{
            color: '#fbbf24', fontSize: '36px', fontWeight: 'bold',
            fontFamily: '"Cinzel", Georgia, serif', lineHeight: 1,
          }}>
            ${bet}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {bet > 0 && (
              <button onClick={clearBet} style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.5)',
                borderRadius: '6px', padding: '4px 12px',
                cursor: 'pointer', fontFamily: '"EB Garamond", Georgia, serif', fontSize: '13px',
              }}>
                Clear
              </button>
            )}
            {lastBet && lastBet >= 2 && bet === 0 && lastBet <= bankroll && (
              <button onClick={useLastBet} style={{
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.3)',
                color: '#fbbf24',
                borderRadius: '6px', padding: '4px 12px',
                cursor: 'pointer', fontFamily: '"EB Garamond", Georgia, serif', fontSize: '13px',
              }}>
                Rebuy ${lastBet}
              </button>
            )}
          </div>
        </div>
      </div>

      {bet >= 2 && (
        <button
          onClick={() => onDeal(bet)}
          style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            border: '2px solid #14532d', color: '#fff',
            borderRadius: '10px', padding: '13px 44px',
            cursor: 'pointer', fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.1em',
            boxShadow: '0 4px 0 #14532d', transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 0 #14532d'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #14532d'; }}
          onMouseDown={e => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 2px 0 #14532d'; }}
        >
          Deal
        </button>
      )}
    </div>
  );
}