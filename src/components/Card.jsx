import { RED_SUITS } from '../lib/deck.js';

const styles = {
  card: {
    width: '80px',
    height: '112px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '6px',
    fontFamily: 'Georgia, serif',
    userSelect: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    position: 'relative',
    flexShrink: 0,
  },
  hidden: {
    backgroundColor: '#1e40af',
    backgroundImage: `repeating-linear-gradient(
      45deg,
      #1e3a8a 0px,
      #1e3a8a 4px,
      #1e40af 4px,
      #1e40af 12px
    )`,
    border: '1px solid #1e3a8a',
  },
  corner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    lineHeight: 1,
    gap: '1px',
  },
  value: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  suit: {
    fontSize: '12px',
  },
  centerSuit: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '28px',
  },
  bottomCorner: {
    transform: 'rotate(180deg)',
  },
};

export default function Card({ card, hidden = false }) {
  if (hidden) {
    return <div style={{ ...styles.card, ...styles.hidden }} />;
  }

  const isRed = RED_SUITS.includes(card.suit);
  const color = isRed ? '#dc2626' : '#111827';

  return (
    <div style={styles.card}>
      <div style={{ ...styles.corner, color }}>
        <span style={styles.value}>{card.value}</span>
        <span style={styles.suit}>{card.suit}</span>
      </div>

      <span style={{ ...styles.centerSuit, color }}>{card.suit}</span>

      <div style={{ ...styles.corner, ...styles.bottomCorner, color }}>
        <span style={styles.value}>{card.value}</span>
        <span style={styles.suit}>{card.suit}</span>
      </div>
    </div>
  );
}