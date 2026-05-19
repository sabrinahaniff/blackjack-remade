import { getHandTotal } from './deck.js';

export function isBust(hand) {
  return getHandTotal(hand) > 21;
}

export function isBlackjack(hand) {
  return hand.length === 2 && getHandTotal(hand) === 21;
}

export function getResult(playerHand, dealerHand) {
  const playerTotal = getHandTotal(playerHand);
  const dealerTotal = getHandTotal(dealerHand);
  const playerBJ = isBlackjack(playerHand);
  const dealerBJ = isBlackjack(dealerHand);

  if (playerBJ && dealerBJ) return 'push';
  if (playerBJ) return 'blackjack';
  if (dealerBJ) return 'lose';
  if (isBust(playerHand)) return 'bust';
  if (isBust(dealerHand)) return 'win';
  if (playerTotal > dealerTotal) return 'win';
  if (playerTotal < dealerTotal) return 'lose';
  return 'push';
}

export function getPayoutMultiplier(result) {
  switch (result) {
    case 'blackjack': return 2.5;  // bet + 1.5x
    case 'win': return 2;          // bet + 1x
    case 'push': return 1;         // bet back
    default: return 0;             // lose everything
  }
}

export function shouldDealerHit(hand) {
  const total = getHandTotal(hand);
  // dealer hits on soft 16 and below, stands on hard/soft 17+
  return total < 17;
}

export function getResultMessage(result, playerName = 'Player') {
  switch (result) {
    case 'blackjack': return `Blackjack! ${playerName} wins 1.5x!`;
    case 'win': return `${playerName} wins!`;
    case 'push': return "Push - bet returned";
    case 'bust': return `Busted! Dealer wins.`;
    case 'lose': return 'Dealer wins.';
    default: return '';
  }
}