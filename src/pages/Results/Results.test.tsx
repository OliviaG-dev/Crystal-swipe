import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { HistoryEntry, MatchResult } from '../../types';
import { stones } from '../../data/stones';
import * as scoring from '../../utils/scoring';
import Results from './Results';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const tourmaline = stones.find((stone) => stone.id === 'tourmaline')!;

function createMatch(): MatchResult {
  return { stone: tourmaline, score: 10, percentage: 100 };
}

function createHistoryEntry(id: string): HistoryEntry {
  return {
    id,
    completedAt: '2026-05-17T12:00:00.000Z',
    matches: [createMatch()],
  };
}

const sessionResults = [{ questionId: '1', liked: true }];

function seedSessionStorage(sessionId = 'session-test') {
  localStorage.setItem(
    'swipeSession',
    JSON.stringify({
      id: sessionId,
      completedAt: '2026-05-17T12:00:00.000Z',
      results: sessionResults,
    })
  );
  localStorage.setItem('swipeResults', JSON.stringify(sessionResults));
}

function seedResultsStorage(historyCount: number) {
  const history = Array.from({ length: historyCount }, (_, index) =>
    createHistoryEntry(`history-${index}`)
  );

  localStorage.setItem('swipeHistory', JSON.stringify(history));
  seedSessionStorage('history-0');
}

describe('Results history', () => {
  beforeEach(() => {
    localStorage.clear();
    navigate.mockClear();
  });

  it('paginates history entries two per page', async () => {
    const user = userEvent.setup();
    seedResultsStorage(3);

    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    const historySection = screen.getByRole('region', { name: /historique/i });
    expect(within(historySection).getByRole('heading', { name: 'Historique' })).toBeInTheDocument();
    expect(screen.getByText('Page 1 / 2')).toBeInTheDocument();
    expect(within(historySection).getAllByRole('article')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Page suivante' }));

    expect(screen.getByText('Page 2 / 2')).toBeInTheDocument();
    expect(within(historySection).getAllByRole('article')).toHaveLength(1);
  });

  it('clears history when clicking the clear button', async () => {
    const user = userEvent.setup();
    seedResultsStorage(2);

    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: "Effacer l'historique" }));

    expect(screen.queryByRole('region', { name: /historique/i })).not.toBeInTheDocument();
    expect(localStorage.getItem('swipeHistory')).toBeNull();
  });

  it('goes to the previous history page', async () => {
    const user = userEvent.setup();
    seedResultsStorage(3);

    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Page suivante' }));
    await user.click(screen.getByRole('button', { name: 'Page précédente' }));

    expect(screen.getByText('Page 1 / 2')).toBeInTheDocument();
  });
});

describe('Results session loading', () => {
  beforeEach(() => {
    localStorage.clear();
    navigate.mockClear();
    vi.restoreAllMocks();
  });

  it('shows a loading state when matches are empty before redirect', () => {
    vi.spyOn(scoring, 'calculateMatches').mockReturnValue([]);
    seedSessionStorage();

    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('assigns tertiary rank to matches beyond the top three', () => {
    const aquamarine = stones.find((stone) => stone.id === 'aquamarine')!;
    const labradorite = stones.find((stone) => stone.id === 'labradorite')!;
    const hematite = stones.find((stone) => stone.id === 'hematite')!;

    vi.spyOn(scoring, 'calculateMatches').mockReturnValue([
      { stone: tourmaline, score: 40, percentage: 100 },
      { stone: aquamarine, score: 30, percentage: 75 },
      { stone: labradorite, score: 20, percentage: 50 },
      { stone: hematite, score: 10, percentage: 25 },
    ]);
    seedSessionStorage();

    const { container } = render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    const cards = container.querySelectorAll('.stone-card');
    expect(cards).toHaveLength(4);
    expect(cards[3]).toHaveClass('stone-card--tertiary');
  });

  it('renders matches from legacy swipeResults storage', () => {
    localStorage.setItem('swipeResults', JSON.stringify(sessionResults));

    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    expect(screen.getByText('Ton Match Energetique')).toBeInTheDocument();
    expect(screen.getAllByText(/% match/).length).toBeGreaterThan(0);
  });

  it('skips history entries without a main match', () => {
    localStorage.setItem(
      'swipeHistory',
      JSON.stringify([
        {
          id: 'null-entry',
          completedAt: '2026-05-17T12:00:00.000Z',
          matches: [null],
        },
        createHistoryEntry('valid-entry'),
      ])
    );
    seedSessionStorage('new-session');

    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    const historySection = screen.getByRole('region', { name: /historique/i });
    expect(within(historySection).getAllByRole('article')).toHaveLength(1);
  });
});

describe('Results actions', () => {
  beforeEach(() => {
    localStorage.clear();
    navigate.mockClear();
  });

  it('redirects to home when there is no valid session', async () => {
    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });

  it('clears storage and navigates to swipe on restart', async () => {
    const user = userEvent.setup();
    seedSessionStorage();

    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Recommencer' }));

    expect(navigate).toHaveBeenCalledWith('/swipe');
    expect(localStorage.getItem('swipeSession')).toBeNull();
    expect(localStorage.getItem('swipeResults')).toBeNull();
  });

  it('clears storage and navigates to home from the secondary action', async () => {
    const user = userEvent.setup();
    seedSessionStorage();

    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: "Retour a l'accueil" }));

    expect(navigate).toHaveBeenCalledWith('/');
    expect(localStorage.getItem('swipeSession')).toBeNull();
    expect(localStorage.getItem('swipeResults')).toBeNull();
  });
});
