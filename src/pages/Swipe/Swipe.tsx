import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../../data/questions';
import type { Question, SwipeResult, SwipeSession } from '../../types';
import SwipeCard from '../../components/SwipeCard/SwipeCard';
import Header from '../../components/Header/Header';
import './Swipe.css';

// Fonction pour mélanger aléatoirement un tableau
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function buildResults(
  shuffled: Question[],
  answers: (boolean | undefined)[]
): SwipeResult[] {
  return shuffled.map((question, index) => ({
    questionId: question.id,
    liked: answers[index]!,
  }));
}

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
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSwipe = (liked: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = liked;
    setAnswers(newAnswers);

    if (isLastQuestion) {
      const finalResults = buildResults(shuffledQuestions, newAnswers);
      const session: SwipeSession = {
        id: createSessionId(),
        completedAt: new Date().toISOString(),
        results: finalResults,
      };

      localStorage.setItem('swipeResults', JSON.stringify(finalResults));
      localStorage.setItem('swipeSession', JSON.stringify(session));
      navigate('/results');
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
        />
      </div>

      {currentIndex > 0 && (
        <button
          type="button"
          className="swipe__prev-button"
          onClick={handlePrevious}
        >
          ← Question précédente
        </button>
      )}

      <div className="swipe__hint">
        <p>
          {isTouchLayout
            ? (
              <>
                Swipe à gauche si c’est{' '}
                <span className="swipe__hint-text--no">NON</span>
                {' '}et à droite si c’est{' '}
                <span className="swipe__hint-text--yes">OUI</span>
                .
              </>
            ) : (
              <>
                Swipe{' '}
                <img src="/icons/swipe-yes.png" alt="" className="swipe__hint-icon" />
                {' '}si ça te ressemble,{' '}
                <img src="/icons/swipe-no.png" alt="" className="swipe__hint-icon" />
                {' '}sinon
              </>
            )}
        </p>
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
