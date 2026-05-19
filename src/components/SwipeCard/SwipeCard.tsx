import { useRef } from 'react';
import type { TouchEvent } from 'react';
import type { Question } from '../../types';
import './SwipeCard.css';

const SWIPE_THRESHOLD = 80;

interface SwipeCardProps {
  question: Question;
  onSwipe: (liked: boolean) => void;
  previousAnswer?: boolean;
  enableVerticalGestures?: boolean;
  onSkip?: () => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
  className?: string;
}

export default function SwipeCard({
  question,
  onSwipe,
  previousAnswer,
  enableVerticalGestures = false,
  onSkip,
  onGoBack,
  canGoBack = false,
  className = '',
}: SwipeCardProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStart.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (enableVerticalGestures && absY > absX && absY >= SWIPE_THRESHOLD) {
      if (deltaY < 0) {
        onSkip?.();
      } else if (canGoBack) {
        onGoBack?.();
      }
      return;
    }

    if (deltaX > SWIPE_THRESHOLD) {
      onSwipe(true);
    } else if (deltaX < -SWIPE_THRESHOLD) {
      onSwipe(false);
    }
  };

  return (
    <div
      className={`swipe-card ${enableVerticalGestures ? 'swipe-card--touch' : ''} ${className}`}
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
