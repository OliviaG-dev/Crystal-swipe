import './Header.css';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'gradient';
}

export default function Header({ 
  title = 'Crystal Swipe', 
  subtitle,
  variant = 'default'
}: HeaderProps) {
  return (
    <header className="header">
      <h1 className={`header__title ${variant === 'gradient' ? 'header__title--gradient' : ''}`}>
        {title}
      </h1>
      {subtitle && <p className="header__subtitle">{subtitle}</p>}
    </header>
  );
}
