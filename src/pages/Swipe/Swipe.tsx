import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../../data/questions';
import { shuffleArray } from '../../utils/swipeResults';
import { saveSwipeSessionAndGoToResults } from '../../utils/swipeSession';
import SwipeCard from '../../components/SwipeCard/SwipeCard';
import Header from '../../components/Header/Header';
import './Swipe.css';

export default function Swipe() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTouchLayout, setIsTouchLayout] = useState(false);

  const shuffledQuestions = useMemo(() => shuffleArray(questions), []);
  const [answers, setAnswers] = useState<(boolean | undefined)[]>(
    () => Array(questions.length).fill(undefined)
  );

  // Détecter la vue mobile/tablette pour adapter l'UI
  useEffect(() => {
    const updateIsTouchLayout = () => {
      const width = window.innerWidth;
      setIsTouchLayout(width <= 1024);
    };

    updateIsTouchLayout();
    window.addEventListener('resize', updateIsTouchLayout);

    return () => {
      window.removeEventListener('resize', updateIsTouchLayout);
    };
  }, []);

  const currentQuestion = shuffledQuestions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;
  const isLastQuestion = currentIndex === shuffledQuestions.length - 1;

  const handlePrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const handleSwipe = (liked: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = liked;
    setAnswers(newAnswers);

    if (isLastQuestion) {
      saveSwipeSessionAndGoToResults(shuffledQuestions, newAnswers, navigate);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = undefined;
    setAnswers(newAnswers);

    if (isLastQuestion) {
      saveSwipeSessionAndGoToResults(shuffledQuestions, newAnswers, navigate);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="swipe">
      <Header title="Swipe tes ressentis" />
      
      <div className="swipe__progress">
        <div className="swipe__progress-bar">
          <div
            className="swipe__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="swipe__progress-text">
          {currentIndex + 1} / {shuffledQuestions.length}
        </p>
      </div>

      <div className="swipe__card-container">
        <SwipeCard
          question={currentQuestion}
          onSwipe={handleSwipe}
          previousAnswer={currentAnswer}
          enableVerticalGestures={isTouchLayout}
          onSkip={handleSkip}
          onGoBack={handlePrevious}
          canGoBack={currentIndex > 0}
        />
      </div>

      {!isTouchLayout && (
        <div className="swipe__nav-actions">
          {currentIndex > 0 && (
            <button
              type="button"
              className="swipe__prev-button"
              onClick={handlePrevious}
            >
              RETOUR
            </button>
          )}
          <button
            type="button"
            className="swipe__skip-button"
            onClick={handleSkip}
          >
            PASSER
          </button>
        </div>
      )}

      <div className={`swipe__hint ${isTouchLayout ? 'swipe__hint--touch' : ''}`}>
        {isTouchLayout ? (
          <div className="swipe__hint-row">
            <p className="swipe__hint-lines">
              <span className="swipe__hint-line">
                <span className="swipe__hint-text--no">← NON</span>
                {' · '}
                <span className="swipe__hint-text--yes">OUI →</span>
              </span>
              <span className="swipe__hint-line">
                <span className="swipe__hint-text--skip">↑ PASSER</span>
                {currentIndex > 0 && (
                  <>
                    {' · '}
                    <span className="swipe__hint-text--back">↓ RETOUR</span>
                  </>
                )}
              </span>
            </p>
          </div>
        ) : (
          <p>
            Swipe{' '}
            <img src="/icons/swipe-yes.png" alt="" className="swipe__hint-icon" />
            {' '}si ça te ressemble,{' '}
            <img src="/icons/swipe-no.png" alt="" className="swipe__hint-icon" />
            {' '}sinon
          </p>
        )}
      </div>

      <button
        type="button"
        className="swipe__back-button"
        onClick={() => navigate('/')}
      >
        ← Revenir à l&apos;accueil
      </button>
    </div>
  );
}
