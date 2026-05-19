import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { getSwipeHistory } from '../../utils/history';
import { formatHistoryDate } from '../../utils/dateFormat';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [latestHistory] = useState(() => getSwipeHistory()[0] ?? null);

  return (
    <div className="home">
      <div className="home__logo-container">
        <img src="/logo.png" alt="Crystal Swipe Logo" className="home__logo" />
      </div>
      <Header
        title="CRYSTAL SWIPE"
        subtitle="Écoute ton ressenti, découvre ta pierre"
        variant="gradient"
      />
      
      <div className="home__content">
        <div className="home__intro">
          <p className="home__description">
            Marre des quizz compliqués et des pierres mystérieuses ? 
            Avec Crystal Swipe, il te suffit de swiper tes ressentis et d'obtenir 
            instantanément ton match énergétique.
          </p>
          <p className="home__description">
            Une façon légère et interactive de découvrir la lithothérapie, sans prise de tête !
          </p>
        </div>

        <div className="home__features">
          <div className="home__feature">
            <span className="home__feature-icon" aria-hidden>
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="14" width="44" height="36" rx="12" fill="url(#home-f1)" stroke="url(#home-f2)" strokeWidth="2"/>
                <path d="M22 32 L16 32 L20 28 M16 32 L20 36" stroke="url(#home-f2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M42 32 L48 32 L44 28 M48 32 L44 36" stroke="url(#home-f2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="home-f1" x1="10" y1="14" x2="54" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="rgba(153,102,204,0.2)"/>
                    <stop offset="1" stopColor="rgba(74,144,226,0.15)"/>
                  </linearGradient>
                  <linearGradient id="home-f2" x1="10" y1="14" x2="54" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9966cc"/>
                    <stop offset="1" stopColor="#4a90e2"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <h3>Fun & Intuitif</h3>
            <p>Swipes simples, rapide, comme un jeu</p>
          </div>
          <div className="home__feature">
            <span className="home__feature-icon" aria-hidden>
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 8 L42 22 L40 40 L32 52 L24 40 L22 22 Z" fill="url(#home-p1)" stroke="url(#home-p2)" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M28 28 L32 24 L36 28 L32 36 Z" fill="url(#home-p2)" opacity="0.9"/>
                <defs>
                  <linearGradient id="home-p1" x1="22" y1="8" x2="42" y2="52" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#c4b5fd"/>
                    <stop offset="0.5" stopColor="#9966cc"/>
                    <stop offset="1" stopColor="#6b46c1"/>
                  </linearGradient>
                  <linearGradient id="home-p2" x1="22" y1="8" x2="42" y2="52" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e9d8fd"/>
                    <stop offset="1" stopColor="#9f7aea"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <h3>Personnalisé</h3>
            <p>Chaque résultat correspond à ton état du moment</p>
          </div>
          <div className="home__feature">
            <span className="home__feature-icon" aria-hidden>
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 14 L16 50 C16 52 18 54 20 54 L28 54 L28 10 L20 10 C18 10 16 12 16 14 Z" fill="url(#home-e1)" stroke="url(#home-e2)" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M48 14 L48 50 C48 52 46 54 44 54 L36 54 L36 10 L44 10 C46 10 48 12 48 14 Z" fill="url(#home-e3)" stroke="url(#home-e2)" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M32 10 L32 54" stroke="url(#home-e2)" strokeWidth="2"/>
                <path d="M30 26 L32 22 L34 26 L32 30 Z" fill="url(#home-e2)"/>
                <defs>
                  <linearGradient id="home-e1" x1="16" y1="10" x2="28" y2="54" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8b5cf6"/>
                    <stop offset="1" stopColor="#5b21b6"/>
                  </linearGradient>
                  <linearGradient id="home-e3" x1="36" y1="10" x2="48" y2="54" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1"/>
                    <stop offset="1" stopColor="#3730a3"/>
                  </linearGradient>
                  <linearGradient id="home-e2" x1="16" y1="10" x2="48" y2="54" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a78bfa"/>
                    <stop offset="1" stopColor="#818cf8"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <h3>Éducatif</h3>
            <p>Découvre les propriétés des pierres de manière ludique</p>
          </div>

          {latestHistory?.matches[0] && (
            <Link
              to={`/stones/${latestHistory.matches[0].stone.id}`}
              className="home__feature home__feature--history"
              aria-label={`Voir la fiche ${latestHistory.matches[0].stone.name}`}
            >
              <span className="home__feature-icon">
                <img
                  src={latestHistory.matches[0].stone.icon}
                  alt=""
                  className="home__feature-stone"
                />
              </span>
              <h3>{latestHistory.matches[0].stone.name}</h3>
              <p>
                {formatHistoryDate(latestHistory.completedAt)}
                <br />
                {latestHistory.matches[0].percentage}% match
              </p>
            </Link>
          )}
        </div>

        <div className="home__cta">
          <Button
            variant="primary"
            onClick={() => navigate('/swipe')}
          >
            Commencer le swipe
          </Button>
        </div>
      </div>
    </div>
  );
}
