import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SwipeResult, MatchResult } from '../../types';
import { questions } from '../../data/questions';
import { calculateMatches } from '../../utils/scoring';
import Header from '../../components/Header/Header';
import StoneCard from '../../components/StoneCard/StoneCard';
import Button from '../../components/Button/Button';
import './Results.css';

function getInitialMatches(): MatchResult[] {
  try {
    const saved = localStorage.getItem('swipeResults');
    if (!saved) return [];
    const results: SwipeResult[] = JSON.parse(saved);
    return calculateMatches(results, questions);
  } catch {
    return [];
  }
}

export default function Results() {
  const navigate = useNavigate();
  const [matches] = useState<MatchResult[]>(getInitialMatches);

  useEffect(() => {
    if (matches.length === 0) {
      navigate('/');
    }
  }, [matches.length, navigate]);

  const handleRestart = () => {
    localStorage.removeItem('swipeResults');
    navigate('/swipe');
  };

  const handleHome = () => {
    localStorage.removeItem('swipeResults');
    navigate('/');
  };

  if (matches.length === 0) {
    return (
      <div className="results">
        <Header title="Chargement..." />
      </div>
    );
  }

  const rankMap: ('primary' | 'secondary' | 'tertiary')[] = ['primary', 'secondary', 'tertiary'];

  return (
    <div className="results">
      <Header
        title="💫 Ton Match Énergétique"
        subtitle="Découvre les pierres qui résonnent avec toi"
      />

      <div className="results__content">
        {matches.map((match, index) => (
          <StoneCard
            key={match.stone.id}
            match={match}
            rank={rankMap[index] || 'tertiary'}
          />
        ))}

        {matches.length === 0 && (
          <div className="results__empty">
            <p>Il semble qu'il n'y ait pas de match pour le moment.</p>
            <p>Essaie de swiper plus de questions !</p>
          </div>
        )}

        <div className="results__actions">
          <Button variant="secondary" onClick={handleHome}>
            Retour à l'accueil
          </Button>
          <Button variant="primary" onClick={handleRestart}>
            Recommencer 
          </Button>
        </div>
      </div>
    </div>
  );
}
