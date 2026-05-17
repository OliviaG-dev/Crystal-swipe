import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../../data/questions';
import type { SwipeResult, SwipeSession } from '../../types';
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

export default function Swipe() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult[]>([]);
  const [isTouchLayout, setIsTouchLayout] = useState(false);

  // Mélanger les questions une seule fois au chargement du composant
  const shuffledQuestions = useMemo(() => shuffleArray(questions), []);

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
  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;
  const isLastQuestion = currentIndex === shuffledQuestions.length - 1;

  const handleSwipe = (liked: boolean) => {
    const newResult: SwipeResult = {
      questionId: currentQuestion.id,
      liked,
    };

    const newResults = [...results, newResult];
    setResults(newResults);

    if (isLastQuestion) {
      // Sauvegarder les résultats et naviguer vers la page de résultats
      const session: SwipeSession = {
        id: createSessionId(),
        completedAt: new Date().toISOString(),
        results: newResults,
      };

      localStorage.setItem('swipeResults', JSON.stringify(newResults));
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
        />
      </div>

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
