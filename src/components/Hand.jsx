import Card from './Card.jsx';

export default function Hand({ hand, label, dealerHidden = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <span style={{ color: '#d1fae5', fontSize: '13px', fontFamily: 'Georgia, serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        {hand.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            hidden={dealerHidden && i === 1}
            dealIndex={i}
          />
        ))}
      </div>
    </div>
  );
}