import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the default title', () => {
    const { container } = render(<Header />);

    expect(screen.getByRole('heading', { name: 'Crystal Swipe' })).toBeInTheDocument();
    expect(container.querySelector('.header__subtitle')).not.toBeInTheDocument();
  });

  it('renders a subtitle and gradient variant', () => {
    const { container } = render(
      <Header title="CRYSTAL SWIPE" subtitle="Écoute ton ressenti" variant="gradient" />
    );

    expect(screen.getByText('Écoute ton ressenti')).toBeInTheDocument();
    expect(container.querySelector('.header__title--gradient')).toBeInTheDocument();
  });
});
