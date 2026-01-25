import type { Question } from '../../types';
import './SwipeCard.css';

interface SwipeCardProps {
  question: Question;
  onSwipe: (liked: boolean) => void;
  className?: string;
}

export default function SwipeCard({ question, onSwipe, className = '' }: SwipeCardProps) {
  return (
    <div className={`swipe-card ${className}`}>
      <div className="swipe-card__emoji">{question.emoji}</div>
      <p className="swipe-card__text">{question.text}</p>
      <div className="swipe-card__actions">
        <button
          className="swipe-card__button swipe-card__button--dislike"
          onClick={() => onSwipe(false)}
          aria-label="Non"
        >
          ❌
        </button>
        <button
          className="swipe-card__button swipe-card__button--like"
          onClick={() => onSwipe(true)}
          aria-label="Oui"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
