import { useState, useCallback } from 'react';
import { createDeck, shuffle, getHandTotal } from '../lib/deck.js';
import { isBust, isBlackjack, getResult, getPayoutMultiplier, shouldDealerHit } from '../lib/gameLogic.js';

const STARTING_BANKROLL = 1000;

export function useBlackjack() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [dealerHidden, setDealerHidden] = useState(true);
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [bet, setBet] = useState(0);
  const [phase, setPhase] = useState('betting'); // betting , player , dealer , result
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const startGame = useCallback((betAmount) => {
    const freshDeck = shuffle(createDeck());
    const pHand = [freshDeck[0], freshDeck[2]];
    const dHand = [freshDeck[1], freshDeck[3]];
    const remaining = freshDeck.slice(4);

    setBet(betAmount);
    setBankroll(prev => prev - betAmount);
    setDeck(remaining);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setDealerHidden(true);
    setResult(null);
    setMessage('');

    // check for immediate blackjack
    if (isBlackjack(pHand)) {
      setDealerHidden(false);
      const res = getResult(pHand, dHand);
      const payout = Math.floor(betAmount * getPayoutMultiplier(res));
      setBankroll(prev => prev + payout);
      setResult(res);
      setPhase('result');
    } else {
      setPhase('player');
    }
  }, []);

  const hit = useCallback(() => {
    setDeck(prev => {
      const [card, ...rest] = prev;
      setPlayerHand(hand => {
        const newHand = [...hand, card];
        if (isBust(newHand)) {
          setDealerHidden(false);
          setResult('bust');
          setPhase('result');
        }
        return newHand;
      });
      return rest;
    });
  }, []);

  const stand = useCallback(() => {
    setDealerHidden(false);
    setPhase('dealer');

    // dealer plays out
    setDeck(prevDeck => {
      let currentDeck = [...prevDeck];
      setDealerHand(prevDealer => {
        let dHand = [...prevDealer];
        while (shouldDealerHit(dHand)) {
          dHand = [...dHand, currentDeck.shift()];
        }
        setPlayerHand(pHand => {
          const res = getResult(pHand, dHand);
          const payout = Math.floor(bet * getPayoutMultiplier(res));
          setBankroll(prev => prev + payout);
          setResult(res);
          setPhase('result');
          return pHand;
        });
        return dHand;
      });
      return currentDeck;
    });
  }, [bet]);

  const doubleDown = useCallback(() => {
    setBankroll(prev => prev - bet);
    setBet(prev => prev * 2);
    setDeck(prev => {
      const [card, ...rest] = prev;
      setPlayerHand(hand => {
        const newHand = [...hand, card];
        if (isBust(newHand)) {
          setDealerHidden(false);
          setResult('bust');
          setPhase('result');
          return newHand;
        }
        // auto stand after double
        setDealerHidden(false);
        setPhase('dealer');
        setDeck(prevDeck => {
          let currentDeck = [...prevDeck];
          setDealerHand(prevDealer => {
            let dHand = [...prevDealer];
            while (shouldDealerHit(dHand)) {
              dHand = [...dHand, currentDeck.shift()];
            }
            const res = getResult(newHand, dHand);
            const payout = Math.floor(bet * 2 * getPayoutMultiplier(res));
            setBankroll(prev => prev + payout);
            setResult(res);
            setPhase('result');
            return dHand;
          });
          return currentDeck;
        });
        return newHand;
      });
      return rest;
    });
  }, [bet]);

  const resetGame = useCallback(() => {
    setPhase('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setBet(0);
    setResult(null);
    setMessage('');
    setDealerHidden(true);
  }, []);

  return {
    playerHand,
    dealerHand,
    dealerHidden,
    bankroll,
    bet,
    phase,
    result,
    message,
    playerTotal: getHandTotal(playerHand),
    dealerTotal: dealerHidden
      ? getHandTotal([dealerHand[0]].filter(Boolean))
      : getHandTotal(dealerHand),
    startGame,
    hit,
    stand,
    doubleDown,
    resetGame,
  };
}