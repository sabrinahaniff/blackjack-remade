import { useState, useCallback, useRef } from 'react';
import { createDeck, shuffle, getHandTotal } from '../lib/deck.js';
import { isBust, isBlackjack, getResult, getPayoutMultiplier, shouldDealerHit } from '../lib/gameLogic.js';

const STARTING_BANKROLL = 1000;
const sleep = ms => new Promise(r => setTimeout(r, ms));

export function useBlackjack() {
  const [playerHand, setPlayerHand] = useState([]);
  const [splitHand, setSplitHand] = useState(null);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [dealerHand, setDealerHand] = useState([]);
  const [dealerHidden, setDealerHidden] = useState(true);
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
  const [bet, setBet] = useState(0);
  const [phase, setPhase] = useState('betting');
  const [result, setResult] = useState(null);
  const [splitResult, setSplitResult] = useState(null);

  const deckRef = useRef([]);
  const betRef = useRef(0);
  const playerHandRef = useRef([]);
  const splitHandRef = useRef(null);
  const dealerHandRef = useRef([]);
  const activeHandIndexRef = useRef(0);

  const runDealerTurn = useCallback(async (pHand, sHand, dHand) => {
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

    const res1 = getResult(pHand, dCurrent);
    const payout1 = Math.floor(betRef.current * getPayoutMultiplier(res1));
    let totalPayout = payout1;
    let res2 = null;

    if (sHand) {
      res2 = getResult(sHand, dCurrent);
      const payout2 = Math.floor(betRef.current * getPayoutMultiplier(res2));
      totalPayout += payout2;
      setSplitResult(res2);
    }

    setBankroll(prev => prev + totalPayout);
    setResult(res1);
    setPhase('result');
  }, []);

  const startGame = useCallback((betAmount) => {
    const freshDeck = shuffle(createDeck());
    const pHand = [freshDeck[0], freshDeck[2]];
    const dHand = [freshDeck[1], freshDeck[3]];

    deckRef.current = freshDeck.slice(4);
    betRef.current = betAmount;
    playerHandRef.current = pHand;
    splitHandRef.current = null;
    dealerHandRef.current = dHand;
    activeHandIndexRef.current = 0;

    setBet(betAmount);
    setBankroll(prev => prev - betAmount);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setSplitHand(null);
    setActiveHandIndex(0);
    setDealerHidden(true);
    setResult(null);
    setSplitResult(null);

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

  const split = useCallback(() => {
    const card1 = playerHandRef.current[0];
    const card2 = playerHandRef.current[1];
    const newCard1 = deckRef.current.shift();
    const newCard2 = deckRef.current.shift();

    const hand1 = [card1, newCard1];
    const hand2 = [card2, newCard2];

    setBankroll(prev => prev - betRef.current);
    playerHandRef.current = hand1;
    splitHandRef.current = hand2;
    activeHandIndexRef.current = 0;

    setPlayerHand(hand1);
    setSplitHand(hand2);
    setActiveHandIndex(0);
  }, []);

  const hit = useCallback(() => {
    const card = deckRef.current.shift();

    if (activeHandIndexRef.current === 0) {
      const newHand = [...playerHandRef.current, card];
      playerHandRef.current = newHand;
      setPlayerHand(newHand);
      if (isBust(newHand)) {
        if (splitHandRef.current) {
          activeHandIndexRef.current = 1;
          setActiveHandIndex(1);
        } else {
          setDealerHidden(false);
          setResult('bust');
          setPhase('result');
        }
      }
    } else {
      const newHand = [...splitHandRef.current, card];
      splitHandRef.current = newHand;
      setSplitHand(newHand);
      if (isBust(newHand)) {
        setSplitResult('bust');
        runDealerTurn(playerHandRef.current, newHand, dealerHandRef.current);
      }
    }
  }, [runDealerTurn]);

  const stand = useCallback(() => {
    if (activeHandIndexRef.current === 0 && splitHandRef.current) {
      activeHandIndexRef.current = 1;
      setActiveHandIndex(1);
    } else {
      runDealerTurn(playerHandRef.current, splitHandRef.current, dealerHandRef.current);
    }
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
    runDealerTurn(newHand, splitHandRef.current, dealerHandRef.current);
  }, [runDealerTurn]);

  const resetGame = useCallback(() => {
    setPhase('betting');
    setPlayerHand([]);
    setSplitHand(null);
    setDealerHand([]);
    setBet(0);
    setResult(null);
    setSplitResult(null);
    setDealerHidden(true);
    setActiveHandIndex(0);
    playerHandRef.current = [];
    splitHandRef.current = null;
    dealerHandRef.current = [];
    activeHandIndexRef.current = 0;
  }, []);

  const canSplit = playerHand.length === 2
    && playerHand[0].value === playerHand[1].value
    && !splitHand
    && bankroll >= betRef.current;

  return {
    playerHand, splitHand, activeHandIndex,
    dealerHand, dealerHidden,
    bankroll, bet, phase, result, splitResult,
    canSplit,
    playerTotal: getHandTotal(playerHand),
    splitTotal: splitHand ? getHandTotal(splitHand) : 0,
    dealerTotal: dealerHidden
      ? getHandTotal([dealerHand[0]].filter(Boolean))
      : getHandTotal(dealerHand),
    startGame, hit, stand, doubleDown, split, resetGame,
  };
}