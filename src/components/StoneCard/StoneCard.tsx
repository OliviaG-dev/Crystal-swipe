import type { MatchResult } from '../../types';
import './StoneCard.css';

interface StoneCardProps {
  match: MatchResult;
  rank: 'primary' | 'secondary' | 'tertiary';
}

export default function StoneCard({ match, rank }: StoneCardProps) {
  const { stone, percentage } = match;

  return (
    <div className={`stone-card stone-card--${rank}`}>
      <div className="stone-card__header">
        <div className="stone-card__icon-wrap">
          <img src={stone.icon} alt="" className="stone-card__icon" />
        </div>
        <div className="stone-card__title-section">
          <h3 className="stone-card__name">{stone.name}</h3>
          {rank === 'primary' && (
            <span className="stone-card__badge">Pierre principale</span>
          )}
          {rank === 'secondary' && (
            <span className="stone-card__badge">Pierre secondaire</span>
          )}
          {rank === 'tertiary' && (
            <span className="stone-card__badge">Pierre complémentaire</span>
          )}
        </div>
      </div>
      <div className="stone-card__match">
        <div className="stone-card__match-bar">
          <div
            className="stone-card__match-fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: stone.color,
            }}
          />
        </div>
        <span className="stone-card__match-percentage">{percentage}% match</span>
      </div>
      <p className="stone-card__description">{stone.description}</p>
      <div className="stone-card__properties">
        <h4 className="stone-card__properties-title">Propriétés :</h4>
        <ul className="stone-card__properties-list">
          {stone.properties.map((property, index) => (
            <li key={index}>{property}</li>
          ))}
        </ul>
      </div>
      <div className="stone-card__usage">
        <p className="stone-card__usage-text">
          <strong>
            <span className="stone-card__sparkle" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" fill={`url(#stone-sparkle-${stone.id})`} stroke={`url(#stone-sparkle-stroke-${stone.id})`} strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M6 18l1-2 2 1-1 2-2-1zM18 6l1-2 2 1-1 2-2-1z" fill={`url(#stone-sparkle-${stone.id})`} opacity="0.8"/>
                <defs>
                  <linearGradient id={`stone-sparkle-${stone.id}`} x1="5" y1="2" x2="19" y2="16" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#c4b5fd"/>
                    <stop offset="0.5" stopColor="#9966cc"/>
                    <stop offset="1" stopColor="#4a90e2"/>
                  </linearGradient>
                  <linearGradient id={`stone-sparkle-stroke-${stone.id}`} x1="5" y1="2" x2="19" y2="16" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e9d8fd"/>
                    <stop offset="1" stopColor="#93c5fd"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            Conseil du jour :
          </strong>{' '}
          {stone.usage}
        </p>
      </div>
    </div>
  );
}
