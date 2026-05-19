import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Question } from '../../types';
import SwipeCard from './SwipeCard';

const mockQuestion: Question = {
  id: 'test-q',
  text: 'Je me sens en forme aujourd’hui',
  icon: '/icons/test.png',
  stoneMatches: {},
};

function swipeTouch(
  element: Element,
  start: { x: number; y: number },
  end: { x: number; y: number }
) {
  fireEvent.touchStart(element, {
    touches: [{ clientX: start.x, clientY: start.y }],
  });
  fireEvent.touchEnd(element, {
    changedTouches: [{ clientX: end.x, clientY: end.y }],
  });
}

describe('SwipeCard', () => {
  it('renders the question and handles button clicks', async () => {
    const user = userEvent.setup();
    const onSwipe = vi.fn();

    render(<SwipeCard question={mockQuestion} onSwipe={onSwipe} />);

    expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Oui' }));
    await user.click(screen.getByRole('button', { name: 'Non' }));

    expect(onSwipe).toHaveBeenNthCalledWith(1, true);
    expect(onSwipe).toHaveBeenNthCalledWith(2, false);
  });

  it('shows the previous answer when provided', () => {
    render(
      <SwipeCard question={mockQuestion} onSwipe={vi.fn()} previousAnswer={false} />
    );

    expect(screen.getByText('Non')).toBeInTheDocument();
    expect(screen.getByText(/Ta réponse actuelle/)).toBeInTheDocument();
  });

  it('shows Oui as the previous answer when the user liked the question', () => {
    render(
      <SwipeCard question={mockQuestion} onSwipe={vi.fn()} previousAnswer />
    );

    const previousAnswer = screen.getByText(/Ta réponse actuelle/);
    expect(within(previousAnswer).getByText('Oui')).toBeInTheDocument();
  });

  it('ignores touch gestures below the swipe threshold', () => {
    const onSwipe = vi.fn();
    const { container } = render(<SwipeCard question={mockQuestion} onSwipe={onSwipe} />);
    const card = container.querySelector('.swipe-card')!;

    swipeTouch(card, { x: 0, y: 0 }, { x: 40, y: 0 });

    expect(onSwipe).not.toHaveBeenCalled();
  });

  it('ignores touch end when touch start was not recorded', () => {
    const onSwipe = vi.fn();
    const { container } = render(<SwipeCard question={mockQuestion} onSwipe={onSwipe} />);
    const card = container.querySelector('.swipe-card')!;

    fireEvent.touchEnd(card, {
      changedTouches: [{ clientX: 100, clientY: 0 }],
    });

    expect(onSwipe).not.toHaveBeenCalled();
  });

  it('triggers onSwipe on horizontal touch gestures', () => {
    const onSwipe = vi.fn();
    const { container } = render(<SwipeCard question={mockQuestion} onSwipe={onSwipe} />);
    const card = container.querySelector('.swipe-card')!;

    swipeTouch(card, { x: 0, y: 0 }, { x: 100, y: 0 });
    swipeTouch(card, { x: 100, y: 0 }, { x: 0, y: 0 });

    expect(onSwipe).toHaveBeenNthCalledWith(1, true);
    expect(onSwipe).toHaveBeenNthCalledWith(2, false);
  });

  it('triggers skip and back on vertical touch gestures', () => {
    const onSwipe = vi.fn();
    const onSkip = vi.fn();
    const onGoBack = vi.fn();
    const { container } = render(
      <SwipeCard
        question={mockQuestion}
        onSwipe={onSwipe}
        enableVerticalGestures
        onSkip={onSkip}
        onGoBack={onGoBack}
        canGoBack
      />
    );
    const card = container.querySelector('.swipe-card')!;

    swipeTouch(card, { x: 0, y: 100 }, { x: 0, y: 0 });
    swipeTouch(card, { x: 0, y: 0 }, { x: 0, y: 100 });

    expect(onSkip).toHaveBeenCalledOnce();
    expect(onGoBack).toHaveBeenCalledOnce();
    expect(onSwipe).not.toHaveBeenCalled();
  });

  it('does not go back on vertical swipe when canGoBack is false', () => {
    const onGoBack = vi.fn();
    const { container } = render(
      <SwipeCard
        question={mockQuestion}
        onSwipe={vi.fn()}
        enableVerticalGestures
        onGoBack={onGoBack}
        canGoBack={false}
      />
    );
    const card = container.querySelector('.swipe-card')!;

    swipeTouch(card, { x: 0, y: 0 }, { x: 0, y: 100 });

    expect(onGoBack).not.toHaveBeenCalled();
  });
});
