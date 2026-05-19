import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { questions } from '../../data/questions';
import Swipe from './Swipe';

const navigate = vi.fn();
const shuffledQuestions = questions.slice(0, 2);

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('../../utils/swipeResults', async () => {
  const actual = await vi.importActual<typeof import('../../utils/swipeResults')>(
    '../../utils/swipeResults'
  );

  return {
    ...actual,
    shuffleArray: vi.fn(() => shuffledQuestions),
  };
});

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
}

describe('Swipe', () => {
  beforeEach(() => {
    localStorage.clear();
    navigate.mockClear();
    setViewportWidth(1280);
  });

  afterEach(() => {
    setViewportWidth(1280);
  });

  it('renders the first question with desktop navigation', () => {
    render(
      <MemoryRouter>
        <Swipe />
      </MemoryRouter>
    );

    expect(screen.getByText(shuffledQuestions[0].text)).toBeInTheDocument();
    expect(screen.getByText(`1 / ${shuffledQuestions.length}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'PASSER' })).toBeInTheDocument();
    expect(screen.getByText(/si ça te ressemble/i)).toBeInTheDocument();
    expect(screen.queryByText('← NON')).not.toBeInTheDocument();
  });

  it('shows touch hints and hides desktop actions on tablet width', async () => {
    render(
      <MemoryRouter>
        <Swipe />
      </MemoryRouter>
    );

    setViewportWidth(768);

    await waitFor(() => {
      expect(screen.getByText('← NON')).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: 'PASSER' })).not.toBeInTheDocument();
  });

  it('advances to the next question and supports back and skip', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Swipe />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Oui' }));

    expect(screen.getByText(shuffledQuestions[1].text)).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'RETOUR' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'RETOUR' }));

    expect(screen.getByText(shuffledQuestions[0].text)).toBeInTheDocument();
    expect(screen.getByText(/Ta réponse actuelle/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'PASSER' }));
    expect(screen.getByText(shuffledQuestions[1].text)).toBeInTheDocument();
  });

  it('shows the back hint on touch layout after the first question', async () => {
    setViewportWidth(768);

    render(
      <MemoryRouter>
        <Swipe />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Oui' }));

    await waitFor(() => {
      expect(screen.getByText('↓ RETOUR')).toBeInTheDocument();
    });
  });

  it('finishes the quiz when skipping the last question', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Swipe />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Oui' }));
    await user.click(screen.getByRole('button', { name: 'PASSER' }));

    expect(navigate).toHaveBeenCalledWith('/results');
    expect(JSON.parse(localStorage.getItem('swipeResults')!)).toEqual([
      { questionId: shuffledQuestions[0].id, liked: true },
    ]);
  });

  it('saves the session and navigates to results on the last answer', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Swipe />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Oui' }));
    await user.click(screen.getByRole('button', { name: 'Non' }));

    expect(navigate).toHaveBeenCalledWith('/results');
    expect(JSON.parse(localStorage.getItem('swipeResults')!)).toEqual([
      { questionId: shuffledQuestions[0].id, liked: true },
      { questionId: shuffledQuestions[1].id, liked: false },
    ]);
    expect(JSON.parse(localStorage.getItem('swipeSession')!).results).toHaveLength(2);
  });

  it('returns to home from the back button', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Swipe />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Revenir à l'accueil/i }));

    expect(navigate).toHaveBeenCalledWith('/');
  });
});
