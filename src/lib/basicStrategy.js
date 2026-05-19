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

