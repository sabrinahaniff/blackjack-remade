import { useState, useEffect, useCallback } from 'react';
import { useBlackjack } from './hooks/useBlackjack.js';
import { useStats } from './hooks/useStats.js';
import Hand from './components/Hand.jsx';
import Chips from './components/Chips.jsx';
import HUD from './components/HUD.jsx';
import Stats from './components/Stats.jsx';
import Confetti from './components/Confetti.jsx';

export default function App() {
  const [bet, setBet] = useState(0);
  const [lastBet, setLastBet] = useState(0);
  const { stats, winRate, recordResult, resetStats } = useStats();
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    playerHand, splitHand, activeHandIndex,
    dealerHand, dealerHidden,
    bankroll, bet: activeBet,
    phase, result, splitResult,
    showInsurance,
    canSplit,
    playerTotal, splitTotal, dealerTotal,
    startGame, hit, stand, doubleDown, split, resetGame, takeInsurance,
  } = useBlackjack();

  useEffect(() => {
    if (result) {
      recordResult(result, activeBet);
      if (splitResult) recordResult(splitResult, activeBet);
      if (result === 'win' || result === 'blackjack' ||
          splitResult === 'win' || splitResult === 'blackjack') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [result]);

  const handleKey = useCallback((e) => {
    if (phase !== 'player') return;
    if (e.key === 'h' || e.key === 'H') hit();
    if (e.key === 's' || e.key === 'S') stand();
    if (e.key === 'd' || e.key === 'D') {
      if (playerHand.length === 2 && bankroll >= activeBet) doubleDown();
    }
    if (e.key === 'p' || e.key === 'P') {
      if (canSplit) split();
    }
  }, [phase, hit, stand, doubleDown, split, canSplit, playerHand, bankroll, activeBet]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#022c22',
      backgroundImage: `
        radial-gradient(ellipse at 50% 0%, #065f46 0%, #022c22 60%),
        repeating-linear-gradient(45deg, transparent, transparent 40px,
          rgba(255,255,255,0.01) 40px, rgba(255,255,255,0.01) 80px)
      `,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '32px 24px 48px',
      gap: '24px',
    }}>
      <Confetti active={showConfetti} />

      {/* header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <h1 className="gold-shimmer" style={{
          fontFamily: '"Cinzel", Georgia, serif',
          fontSize: '52px',
          fontWeight: '900',
          letterSpacing: '0.2em',
          margin: 0,
          lineHeight: 1,
        }}>
          Blackjack
        </h1>
        <span style={{
          color: 'rgba(255,255,255,0.25)',
          fontFamily: '"EB Garamond", Georgia, serif',
          fontSize: '13px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
        }}>
          Las Vegas Rules
        </span>
      </div>

      <Stats stats={stats} winRate={winRate} onReset={resetStats} />

      {/* table */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '28px',
        background: 'rgba(0,0,0,0.25)',
        borderRadius: '32px',
        padding: '36px 52px',
        border: '1px solid rgba(255,255,255,0.07)',
        minWidth: '520px',
        maxWidth: '700px',
        width: '100%',
        position: 'relative',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>

        {/* gold ring */}
        <div style={{
          position: 'absolute', inset: '-3px', borderRadius: '34px',
          border: '1px solid rgba(251,191,36,0.12)', pointerEvents: 'none',
        }} />

        {/* dealer hand */}
        {dealerHand.length > 0 && (
          <Hand
            hand={dealerHand}
            label={phase === 'dealer' ? 'Dealer is thinking...'
              : !dealerHidden ? `Dealer — ${dealerTotal}` : 'Dealer'}
            dealerHidden={dealerHidden}
            isThinking={phase === 'dealer'}
          />
        )}

        {dealerHand.length > 0 && playerHand.length > 0 && (
          <div style={{
            width: '100%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          }} />
        )}

        {/* player hands */}
        {playerHand.length > 0 && (
          splitHand ? (
            <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>

              {/* hand 1 */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                opacity: phase === 'player' && activeHandIndex !== 0 ? 0.45 : 1,
                transition: 'opacity 0.3s',
              }}>
                <Hand hand={playerHand} label={`Hand 1 — ${playerTotal}`} />
                {phase === 'player' && activeHandIndex === 0 && (
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#4ade80', boxShadow: '0 0 8px #4ade80',
                  }} />
                )}
                {phase === 'result' && result && (
                  <div className="result-pop" style={{
                    color: ['win','blackjack'].includes(result) ? '#4ade80' : result === 'push' ? '#fbbf24' : '#f87171',
                    fontFamily: '"Cinzel", serif', fontSize: '14px', fontWeight: 'bold',
                  }}>
                    {result === 'blackjack' ? 'BJ!' : result.charAt(0).toUpperCase() + result.slice(1)}
                  </div>
                )}
              </div>

              {/* hand 2 */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                opacity: phase === 'player' && activeHandIndex !== 1 ? 0.45 : 1,
                transition: 'opacity 0.3s',
              }}>
                <Hand hand={splitHand} label={`Hand 2 — ${splitTotal}`} />
                {phase === 'player' && activeHandIndex === 1 && (
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#4ade80', boxShadow: '0 0 8px #4ade80',
                  }} />
                )}
                {phase === 'result' && splitResult && (
                  <div className="result-pop" style={{
                    color: ['win','blackjack'].includes(splitResult) ? '#4ade80' : splitResult === 'push' ? '#fbbf24' : '#f87171',
                    fontFamily: '"Cinzel", serif', fontSize: '14px', fontWeight: 'bold',
                  }}>
                    {splitResult === 'blackjack' ? 'BJ!' : splitResult.charAt(0).toUpperCase() + splitResult.slice(1)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Hand hand={playerHand} label={`You — ${playerTotal}`} />
          )
        )}

        {/* betting */}
        {phase === 'betting' && (
          <Chips
            bet={bet}
            setBet={setBet}
            bankroll={bankroll}
            lastBet={lastBet}
            onDeal={(amount) => {
              setLastBet(amount);
              startGame(amount);
              setBet(0);
            }}
          />
        )}

        {/* HUD */}
        {phase !== 'betting' && (
          <>
            <HUD
              phase={phase}
              result={result}
              splitResult={splitResult}
              playerHand={playerHand}
              dealerHand={dealerHand}
              dealerHidden={dealerHidden}
              bankroll={bankroll}
              bet={activeBet}
              canSplit={canSplit}
              showInsurance={showInsurance}
              onHit={hit}
              onStand={stand}
              onDouble={doubleDown}
              onSplit={split}
              onInsurance={takeInsurance}
              onNext={resetGame}
            />

            {phase === 'player' && (
              <div style={{ display: 'flex', gap: '16px' }}>
                {[['H','Hit'],['S','Stand'],['D','Double'],['P','Split']].map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '4px', padding: '1px 6px',
                      fontFamily: 'monospace', fontSize: '11px',
                      color: 'rgba(255,255,255,0.4)',
                    }}>{key}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: '"EB Garamond", serif' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}