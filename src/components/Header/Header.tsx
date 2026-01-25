import './Header.css';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title = 'Crystal Swipe', subtitle }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>
      {subtitle && <p className="header__subtitle">{subtitle}</p>}
    </header>
  );
}
