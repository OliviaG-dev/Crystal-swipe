import { Link, useNavigate, useParams } from 'react-router-dom';
import { stones } from '../../data/stones';
import Button from '../../components/Button/Button';
import './StoneDetail.css';

export default function StoneDetail() {
  const navigate = useNavigate();
  const { stoneId } = useParams();
  const stone = stones.find((item) => item.id === stoneId);

  if (!stone) {
    return (
      <div className="stone-detail">
        <div className="stone-detail__not-found">
          <h1>Pierre introuvable</h1>
          <p>Cette fiche n'existe pas encore ou le lien n'est plus valide.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Retour a l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const associatedStones = stone.associations
    .map((associationId) => stones.find((item) => item.id === associationId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="stone-detail">
      <button
        type="button"
        className="stone-detail__back"
        onClick={() => navigate(-1)}
      >
        Retour
      </button>

      <section className="stone-detail__hero">
        <div className="stone-detail__image-wrap">
          <img src={stone.icon} alt="" className="stone-detail__image" />
        </div>

        <div className="stone-detail__intro">
          <span className="stone-detail__eyebrow">Fiche pierre</span>
          <h1>{stone.name}</h1>
          <p className="stone-detail__description">{stone.description}</p>
          <div className="stone-detail__chakra">
            <span>Chakra / usage</span>
            <strong>{stone.chakra}</strong>
          </div>
        </div>
      </section>

      <section className="stone-detail__grid">
        <article className="stone-detail__panel stone-detail__panel--wide">
          <h2>Signification</h2>
          <p>{stone.meaning}</p>
        </article>

        <article className="stone-detail__panel">
          <h2>Quand l'utiliser</h2>
          <ul>
            {stone.useWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="stone-detail__panel">
          <h2>Proprietes</h2>
          <ul>
            {stone.properties.map((property) => (
              <li key={property}>{property}</li>
            ))}
          </ul>
        </article>

        <article className="stone-detail__panel stone-detail__panel--wide">
          <h2>Rituel rapide</h2>
          <p>{stone.ritual}</p>
        </article>

        <article className="stone-detail__panel stone-detail__panel--wide">
          <h2>Associations</h2>
          <div className="stone-detail__associations">
            {associatedStones.map((associatedStone) => (
              <Link
                key={associatedStone.id}
                to={`/stones/${associatedStone.id}`}
                className="stone-detail__association"
              >
                <img src={associatedStone.icon} alt="" />
                <span>{associatedStone.name}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="stone-detail__panel stone-detail__panel--note">
          <h2>Note douce</h2>
          <p>{stone.disclaimer}</p>
        </article>
      </section>
    </main>
  );
}
