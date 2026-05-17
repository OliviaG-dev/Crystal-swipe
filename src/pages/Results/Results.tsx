import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SwipeResult, MatchResult, SwipeSession, HistoryEntry } from '../../types';
import { questions } from '../../data/questions';
import { calculateMatches } from '../../utils/scoring';
import { clearSwipeHistory, getSwipeHistory, saveSwipeHistoryEntry } from '../../utils/history';
import Header from '../../components/Header/Header';
import StoneCard from '../../components/StoneCard/StoneCard';
import Button from '../../components/Button/Button';
import './Results.css';

function getInitialSession(): SwipeSession | null {
  try {
    const savedSession = localStorage.getItem('swipeSession');
    if (savedSession) {
      const session: SwipeSession = JSON.parse(savedSession);
      if (Array.isArray(session.results)) return session;
    }

    const saved = localStorage.getItem('swipeResults');
    if (!saved) return null;
    const results: SwipeResult[] = JSON.parse(saved);

    return {
      id: `legacy-${Date.now()}`,
      completedAt: new Date().toISOString(),
      results,
    };
  } catch {
    return null;
  }
}

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function Results() {
  const navigate = useNavigate();
  const [session] = useState<SwipeSession | null>(getInitialSession);
  const [matches] = useState<MatchResult[]>(() =>
    session ? calculateMatches(session.results, questions) : []
  );
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (!session || matches.length === 0) return getSwipeHistory();
    return saveSwipeHistoryEntry(session, matches);
  });

  useEffect(() => {
    if (matches.length === 0) {
      navigate('/');
    }
  }, [matches.length, navigate]);

  const handleRestart = () => {
    localStorage.removeItem('swipeResults');
    localStorage.removeItem('swipeSession');
    navigate('/swipe');
  };

  const handleHome = () => {
    localStorage.removeItem('swipeResults');
    localStorage.removeItem('swipeSession');
    navigate('/');
  };

  const handleClearHistory = () => {
    clearSwipeHistory();
    setHistory([]);
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
        title="Ton Match Energetique"
        subtitle="Decouvre les pierres qui resonnent avec toi"
      />

      <div className="results__content">
        {matches.map((match, index) => (
          <StoneCard
            key={match.stone.id}
            match={match}
            rank={rankMap[index] || 'tertiary'}
          />
        ))}

        <div className="results__actions">
          <Button variant="secondary" onClick={handleHome}>
            Retour a l'accueil
          </Button>
          <Button variant="primary" onClick={handleRestart}>
            Recommencer
          </Button>
        </div>

        {history.length > 0 && (
          <section className="results__history" aria-labelledby="history-title">
            <div className="results__history-header">
              <h2 id="history-title">Historique des tirages</h2>
              <button
                type="button"
                className="results__history-clear"
                onClick={handleClearHistory}
              >
                Effacer
              </button>
            </div>
            <div className="results__history-list">
              {history.map((entry) => {
                const mainMatch = entry.matches[0];
                if (!mainMatch) return null;

                return (
                  <article key={entry.id} className="results__history-item">
                    <img
                      src={mainMatch.stone.icon}
                      alt=""
                      className="results__history-icon"
                    />
                    <div className="results__history-body">
                      <span className="results__history-date">
                        {formatHistoryDate(entry.completedAt)}
                      </span>
                      <strong>{mainMatch.stone.name}</strong>
                      <span>{mainMatch.percentage}% match</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
