import { getHandTotal, isSoft } from './deck.js';

const HARD = {
  //        2    3    4    5    6    7    8    9   10    A
  21: ['S','S','S','S','S','S','S','S','S','S'],
  20: ['S','S','S','S','S','S','S','S','S','S'],
  19: ['S','S','S','S','S','S','S','S','S','S'],
  18: ['S','S','S','S','S','S','S','S','S','S'],
  17: ['S','S','S','S','S','S','S','S','S','S'],
  16: ['S','S','S','S','S','H','H','H','H','H'],
  15: ['S','S','S','S','S','H','H','H','H','H'],
  14: ['S','S','S','S','S','H','H','H','H','H'],
  13: ['S','S','S','S','S','H','H','H','H','H'],
  12: ['H','H','S','S','S','H','H','H','H','H'],
  11: ['D','D','D','D','D','D','D','D','D','H'],
  10: ['D','D','D','D','D','D','D','D','H','H'],
   9: ['H','D','D','D','D','H','H','H','H','H'],
   8: ['H','H','H','H','H','H','H','H','H','H'],
};

const SOFT = {
  //        2    3    4    5    6    7    8    9   10    A
  20: ['S','S','S','S','S','S','S','S','S','S'],
  19: ['S','S','S','S','D','S','S','H','H','H'],
  18: ['D','D','D','D','D','S','S','H','H','H'],
  17: ['H','D','D','D','D','H','H','H','H','H'],
  16: ['H','H','D','D','D','H','H','H','H','H'],
  15: ['H','H','D','D','D','H','H','H','H','H'],
  14: ['H','H','H','D','D','H','H','H','H','H'],
  13: ['H','H','H','D','D','H','H','H','H','H'],
};

const PAIRS = {
  //        2    3    4    5    6    7    8    9   10    A
  'A': ['P','P','P','P','P','P','P','P','P','P'],
  '9': ['P','P','P','P','P','S','P','P','S','S'],
  '8': ['P','P','P','P','P','P','P','P','P','P'],
  '7': ['P','P','P','P','P','P','H','H','H','H'],
  '6': ['P','P','P','P','P','H','H','H','H','H'],
  '5': ['D','D','D','D','D','D','D','D','H','H'],
  '4': ['H','H','H','P','P','H','H','H','H','H'],
  '3': ['P','P','P','P','P','P','H','H','H','H'],
  '2': ['P','P','P','P','P','P','H','H','H','H'],
};

function dealerIndex(dealerCard) {
  if (dealerCard.value === 'A') return 9;
  if (['J','Q','K'].includes(dealerCard.value)) return 8;
  return parseInt(dealerCard.value) - 2;
}

export function getHint(playerHand, dealerUpcard) {
  const di = dealerIndex(dealerUpcard);
  const total = getHandTotal(playerHand);

  if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
    const key = playerHand[0].value;
    if (!['J','Q','K'].includes(key) && PAIRS[key]) {
      return PAIRS[key][di];
    }
  }

  if (isSoft(playerHand) && SOFT[total]) {
    return SOFT[total][di];
  }

  const clampedTotal = Math.min(Math.max(total, 8), 21);
  return (HARD[clampedTotal] && HARD[clampedTotal][di]) || 'S';
}