import { useState, useCallback, useRef } from 'react';
import { createDeck, shuffle, getHandTotal } from '../lib/deck.js';
import { isBust, isBlackjack, getResult, getPayoutMultiplier, shouldDealerHit } from '../lib/gameLogic.js';

const STARTING_BANKROLL = 1000;
const sleep = ms => new Promise(r => setTimeout(r, ms));

export function useBlackjack() {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [dealerHidden, setDealerHidden] = useState(true);
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [bet, setBet] = useState(0);
  const [phase, setPhase] = useState('betting');
  const [result, setResult] = useState(null);

  const deckRef = useRef([]);
  const betRef = useRef(0);
  const playerHandRef = useRef([]);
  const dealerHandRef = useRef([]);

  const runDealerTurn = useCallback(async (pHand, dHand) => {
    setDealerHidden(false);
    setPhase('dealer');
    await sleep(500);

    let dCurrent = [...dHand];
    while (shouldDealerHit(dCurrent)) {
      const card = deckRef.current.shift();
      dCurrent = [...dCurrent, card];
      setDealerHand([...dCurrent]);
      dealerHandRef.current = dCurrent;
      await sleep(700);
    }

    const res = getResult(pHand, dCurrent);
    const payout = Math.floor(betRef.current * getPayoutMultiplier(res));
    setBankroll(prev => prev + payout);
    setResult(res);
    setPhase('result');
  }, []);

  const startGame = useCallback((betAmount) => {
    const freshDeck = shuffle(createDeck());
    const pHand = [freshDeck[0], freshDeck[2]];
    const dHand = [freshDeck[1], freshDeck[3]];

    deckRef.current = freshDeck.slice(4);
    betRef.current = betAmount;
    playerHandRef.current = pHand;
    dealerHandRef.current = dHand;

    setBet(betAmount);
    setBankroll(prev => prev - betAmount);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setDealerHidden(true);
    setResult(null);

    if (isBlackjack(pHand)) {
      setTimeout(() => {
        setDealerHidden(false);
        const res = getResult(pHand, dHand);
        setBankroll(prev => prev + Math.floor(betAmount * getPayoutMultiplier(res)));
        setResult(res);
        setPhase('result');
      }, 600);
    } else {
      setPhase('player');
    }
  }, []);

  const hit = useCallback(() => {
    const card = deckRef.current.shift();
    const newHand = [...playerHandRef.current, card];
    playerHandRef.current = newHand;
    setPlayerHand(newHand);
    if (isBust(newHand)) {
      setDealerHidden(false);
      setResult('bust');
      setPhase('result');
    }
  }, []);

  const stand = useCallback(() => {
    runDealerTurn(playerHandRef.current, dealerHandRef.current);
  }, [runDealerTurn]);

  const doubleDown = useCallback(() => {
    const card = deckRef.current.shift();
    const currentBet = betRef.current;
    betRef.current = currentBet * 2;
    setBet(currentBet * 2);
    setBankroll(prev => prev - currentBet);

    const newHand = [...playerHandRef.current, card];
    playerHandRef.current = newHand;
    setPlayerHand(newHand);

    if (isBust(newHand)) {
      setDealerHidden(false);
      setResult('bust');
      setPhase('result');
      return;
    }
    runDealerTurn(newHand, dealerHandRef.current);
  }, [runDealerTurn]);

  const resetGame = useCallback(() => {
    setPhase('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setBet(0);
    setResult(null);
    setDealerHidden(true);
    playerHandRef.current = [];
    dealerHandRef.current = [];
  }, []);

  return {
    playerHand, dealerHand, dealerHidden,
    bankroll, bet, phase, result,
    playerTotal: getHandTotal(playerHand),
    dealerTotal: dealerHidden
      ? getHandTotal([dealerHand[0]].filter(Boolean))
      : getHandTotal(dealerHand),
    startGame, hit, stand, doubleDown, resetGame,
  };
}