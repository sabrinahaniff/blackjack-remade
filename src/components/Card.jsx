import { useEffect, useRef, useState } from 'react';
import { RED_SUITS } from '../lib/deck.js';

export default function Card({ card, hidden = false, dealIndex = 0 }) {
  const [rotation, setRotation] = useState(hidden ? 180 : 0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (!hidden) setRotation(prev => prev + 180);
  }, [hidden]);

  const isRed = card && RED_SUITS.includes(card.suit);
  const color = isRed ? '#dc2626' : '#111827';

  return (
    <div
      className="card-deal"
      style={{
        width: '80px',
        height: '112px',
        perspective: '600px',
        flexShrink: 0,
        animationDelay: `${dealIndex * 0.12}s`,
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: mounted.current ? 'transform 0.55s ease-in-out' : 'none',
        transform: `rotateY(${rotation}deg)`,
      }}>

        {/* Back face */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          borderRadius: '8px',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          backgroundColor: '#1e40af',
          backgroundImage: `repeating-linear-gradient(45deg, #1e3a8a 0px, #1e3a8a 4px, #1e40af 4px, #1e40af 12px)`,
          border: '1px solid #1e3a8a',
          transform: 'rotateY(180deg)',
        }} />

        {/* Front face */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          borderRadius: '8px',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '6px',
          fontFamily: 'Georgia, serif',
          userSelect: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, gap: '1px', color }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{card?.value}</span>
            <span style={{ fontSize: '12px' }}>{card?.suit}</span>
          </div>
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '28px', color }}>
            {card?.suit}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, gap: '1px', transform: 'rotate(180deg)', color }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{card?.value}</span>
            <span style={{ fontSize: '12px' }}>{card?.suit}</span>
          </div>
        </div>

      </div>
    </div>
  );
}