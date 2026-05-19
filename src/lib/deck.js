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

