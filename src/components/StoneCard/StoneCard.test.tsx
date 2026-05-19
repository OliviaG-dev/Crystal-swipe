import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { stones } from '../../data/stones';
import StoneCard from './StoneCard';

const tourmaline = stones.find((stone) => stone.id === 'tourmaline')!;

function renderStoneCard(rank: 'primary' | 'secondary' | 'tertiary') {
  return render(
    <MemoryRouter>
      <StoneCard
        rank={rank}
        match={{
          stone: tourmaline,
          score: 12,
          percentage: 88,
        }}
      />
    </MemoryRouter>
  );
}

describe('StoneCard', () => {
  it('renders stone info, match percentage and detail link', () => {
    renderStoneCard('primary');

    expect(screen.getByRole('heading', { name: tourmaline.name })).toBeInTheDocument();
    expect(screen.getByText('88% match')).toBeInTheDocument();
    expect(screen.getByText('Pierre principale')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voir la fiche pierre' })).toHaveAttribute(
      'href',
      '/stones/tourmaline'
    );
  });

  it('shows the secondary badge for secondary rank', () => {
    renderStoneCard('secondary');

    expect(screen.getByText('Pierre secondaire')).toBeInTheDocument();
    expect(screen.queryByText('Pierre complémentaire')).not.toBeInTheDocument();
  });

  it('shows the tertiary badge for tertiary rank', () => {
    renderStoneCard('tertiary');

    expect(screen.getByText('Pierre complémentaire')).toBeInTheDocument();
    expect(screen.queryByText('Pierre principale')).not.toBeInTheDocument();
    expect(screen.queryByText('Pierre secondaire')).not.toBeInTheDocument();
  });
});
