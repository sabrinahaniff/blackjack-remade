// basic strat, mathematically optimal play for every possible hand
// just like my old app returns 'H' (hit), 'S' (stand), 'D' (double), 'P' (split)

// hard totals vs dealer upcard (2-10, A)
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

// soft totals (hand contains an ace counting as 11)
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

// pairs
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

