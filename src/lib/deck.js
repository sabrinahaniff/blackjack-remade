export const SUITS = ['♠', '♥', '♦', '♣'];
export const VALUES = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
export const RED_SUITS = ['♥', '♦'];

export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, id: `${value}${suit}` });
    }
  }
  return deck;
}

export function shuffle(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

export function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

export function getHandTotal(hand) {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    total += getCardValue(card);
    if (card.value === 'A') aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

export function isSoft(hand) {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    total += getCardValue(card);
    if (card.value === 'A') aces++;
  }
  // soft = has an ace counting as 11
  return aces > 0 && total <= 21;
}