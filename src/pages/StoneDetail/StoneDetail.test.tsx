import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { stones } from '../../data/stones';
import StoneDetail from './StoneDetail';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const tourmaline = stones.find((stone) => stone.id === 'tourmaline')!;

function renderStoneDetailRoute(stoneId: string) {
  return render(
    <MemoryRouter initialEntries={[`/stones/${stoneId}`]}>
      <Routes>
        <Route path="/stones/:stoneId" element={<StoneDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('StoneDetail', () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it('renders the stone sheet with associations', () => {
    renderStoneDetailRoute('tourmaline');

    expect(screen.getByRole('heading', { name: tourmaline.name })).toBeInTheDocument();
    expect(screen.getByText(tourmaline.description)).toBeInTheDocument();
    expect(screen.getByText('Signification')).toBeInTheDocument();
    expect(screen.getByText('Rituel rapide')).toBeInTheDocument();

    const associations = screen.getByRole('heading', { name: 'Associations' }).closest('article');
    expect(
      within(associations!).getByRole('link', { name: 'Labradorite' })
    ).toHaveAttribute('href', '/stones/labradorite');
  });

  it('navigates back from the detail page', async () => {
    const user = userEvent.setup();
    renderStoneDetailRoute('tourmaline');

    await user.click(screen.getByRole('button', { name: 'Retour' }));

    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('shows a not found state for unknown stones', async () => {
    const user = userEvent.setup();
    renderStoneDetailRoute('unknown-stone');

    expect(screen.getByRole('heading', { name: 'Pierre introuvable' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: "Retour a l'accueil" }));

    expect(navigate).toHaveBeenCalledWith('/');
  });
});
