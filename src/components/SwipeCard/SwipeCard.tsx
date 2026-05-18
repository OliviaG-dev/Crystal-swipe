import { useRef } from 'react';
import type { TouchEvent } from 'react';
import type { Question } from '../../types';
import './SwipeCard.css';

interface SwipeCardProps {
  question: Question;
  onSwipe: (liked: boolean) => void;
  previousAnswer?: boolean;
  className?: string;
}

export default function SwipeCard({
  question,
  onSwipe,
  previousAnswer,
  className = '',
}: SwipeCardProps) {
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const threshold = 80;

    if (deltaX > threshold) {
      // Swipe vers la droite → oui
      onSwipe(true);
    } else if (deltaX < -threshold) {
      // Swipe vers la gauche → non
      onSwipe(false);
    }

    touchStartX.current = null;
  };

  return (
    <div
      className={`swipe-card ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="swipe-card__icon-wrap">
        <img src={question.icon} alt="" className="swipe-card__icon" />
      </div>
      <p className="swipe-card__text">{question.text}</p>
      {previousAnswer !== undefined && (
        <p className="swipe-card__previous-answer">
          Ta réponse actuelle :{' '}
          <strong className={previousAnswer ? 'swipe-card__answer--yes' : 'swipe-card__answer--no'}>
            {previousAnswer ? 'Oui' : 'Non'}
          </strong>
        </p>
      )}
      <div className="swipe-card__actions">
        <button
          className="swipe-card__button swipe-card__button--dislike"
          onClick={() => onSwipe(false)}
          aria-label="Non"
        >
          <img src="/icons/swipe-no.png" alt="" className="swipe-card__button-icon" />
        </button>
        <button
          className="swipe-card__button swipe-card__button--like"
          onClick={() => onSwipe(true)}
          aria-label="Oui"
        >
          <img src="/icons/swipe-yes.png" alt="" className="swipe-card__button-icon" />
        </button>
      </div>
    </div>
  );
}
