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
        <div className="stone-card__emoji">{stone.emoji}</div>
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
          <strong>✨ Conseil du jour :</strong> {stone.usage}
        </p>
      </div>
    </div>
  );
}
