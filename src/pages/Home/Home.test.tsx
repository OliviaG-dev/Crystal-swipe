import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { stones } from '../../data/stones';
import type { HistoryEntry, MatchResult } from '../../types';
import Home from './Home';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const tourmaline = stones.find((stone) => stone.id === 'tourmaline')!;

function seedLatestHistory() {
  const entry: HistoryEntry = {
    id: 'home-history',
    completedAt: '2026-05-17T12:00:00.000Z',
    matches: [{ stone: tourmaline, score: 10, percentage: 88 } satisfies MatchResult],
  };

  localStorage.setItem('swipeHistory', JSON.stringify([entry]));
}

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
    navigate.mockClear();
  });

  it('renders the intro and starts the swipe flow', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/match énergétique/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Fun & Intuitif' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Commencer le swipe' }));

    expect(navigate).toHaveBeenCalledWith('/swipe');
  });

  it('shows the latest history card linking to the stone detail page', () => {
    seedLatestHistory();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const historyLink = screen.getByRole('link', {
      name: `Voir la fiche ${tourmaline.name}`,
    });

    expect(historyLink).toHaveAttribute('href', '/stones/tourmaline');
    expect(historyLink).toHaveTextContent('88% match');
  });

  it('does not render a history card when storage is empty', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: /Voir la fiche/i })).not.toBeInTheDocument();
  });
});
