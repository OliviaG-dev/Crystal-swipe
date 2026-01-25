import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home__logo-container">
        <img src="/logo.png" alt="Crystal Swipe Logo" className="home__logo" />
      </div>
      <Header
        title="CRYSTAL SWIPE"
        subtitle="Swipe ta vibe, découvre ta pierre"
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
            <span className="home__feature-emoji">🎮</span>
            <h3>Fun & Intuitif</h3>
            <p>Swipes simples, rapide, comme un jeu</p>
          </div>
          <div className="home__feature">
            <span className="home__feature-emoji">💎</span>
            <h3>Personnalisé</h3>
            <p>Chaque résultat correspond à ton état du moment</p>
          </div>
          <div className="home__feature">
            <span className="home__feature-emoji">🔮</span>
            <h3>Éducatif</h3>
            <p>Découvre les propriétés des pierres de manière ludique</p>
          </div>
        </div>

        <div className="home__cta">
          <Button
            variant="primary"
            onClick={() => navigate('/swipe')}
          >
            Commencer le swipe ✨
          </Button>
        </div>
      </div>
    </div>
  );
}
