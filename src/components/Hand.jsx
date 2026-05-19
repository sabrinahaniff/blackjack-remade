import Card from './Card.jsx';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  label: {
    color: '#d1fae5',
    fontSize: '13px',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  cards: {
    display: 'flex',
    flexDirection: 'row',
    gap: '-12px',
  },
  cardWrapper: {
    marginRight: '-12px',
  },
  total: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '20px',
    padding: '2px 14px',
  },
};

export default function Hand({ hand, label, dealerHidden = false }) {
  return (
    <div style={styles.container}>
      <span style={styles.label}>{label}</span>

      <div style={styles.cards}>
        {hand.map((card, i) => (
          <div key={card.id} style={styles.cardWrapper}>
            <Card
              card={card}
              hidden={dealerHidden && i === 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}