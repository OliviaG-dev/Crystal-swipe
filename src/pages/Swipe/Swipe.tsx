import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../../data/questions';
import type { SwipeResult, Question } from '../../types';
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

export default function Swipe() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult[]>([]);

  // Mélanger les questions une seule fois au chargement du composant
  const shuffledQuestions = useMemo(() => shuffleArray(questions), []);

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
      localStorage.setItem('swipeResults', JSON.stringify(newResults));
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
        <p>Swipe ❤️ si ça te ressemble, ❌ sinon</p>
      </div>
    </div>
  );
}
