const CHIP_VALUES = [2, 5, 25, 100, 500];

const CHIP_COLORS = {
  2:   { bg: '#dc2626', border: '#991b1b', text: '#fff' },
  5:   { bg: '#d97706', border: '#92400e', text: '#fff' },
  25:  { bg: '#16a34a', border: '#14532d', text: '#fff' },
  100: { bg: '#1d4ed8', border: '#1e3a8a', text: '#fff' },
  500: { bg: '#7c3aed', border: '#4c1d95', text: '#fff' },
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  label: {
    color: '#d1fae5',
    fontSize: '13px',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  chips: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: (value) => ({
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: CHIP_COLORS[value].bg,
    border: `4px dashed ${CHIP_COLORS[value].border}`,
    color: CHIP_COLORS[value].text,
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    transition: 'transform 0.1s',
  }),
  betDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  betAmount: {
    color: '#fbbf24',
    fontSize: '28px',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
    minWidth: '80px',
    textAlign: 'center',
  },
  clearBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    borderRadius: '6px',
    padding: '6px 14px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
  },
  dealBtn: {
    background: '#16a34a',
    border: '2px solid #14532d',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 36px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    transition: 'background 0.15s',
  },
};

export default function Chips({ bet, setBet, bankroll, onDeal }) {
  const addChip = (value) => {
    if (bet + value > bankroll) return;
    if (bet + value > 500) return;
    setBet(prev => prev + value);
  };

  return (
    <div style={styles.container}>
      <span style={styles.label}>Place your bet</span>

      <div style={styles.chips}>
        {CHIP_VALUES.map(value => (
          <div
            key={value}
            style={styles.chip(value)}
            onClick={() => addChip(value)}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            ${value}
          </div>
        ))}
      </div>

      <div style={styles.betDisplay}>
        <span style={styles.betAmount}>${bet}</span>
        {bet > 0 && (
          <button style={styles.clearBtn} onClick={() => setBet(0)}>
            Clear
          </button>
        )}
      </div>

      {bet >= 2 && (
        <button
          style={styles.dealBtn}
          onClick={() => onDeal(bet)}
          onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
          onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
        >
          Deal
        </button>
      )}
    </div>
  );
}