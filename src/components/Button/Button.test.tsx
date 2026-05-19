import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renders children and calls onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button variant="primary" onClick={onClick}>
        Commencer
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Commencer' });
    expect(button).toHaveClass('button--primary');

    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button variant="secondary" onClick={onClick} disabled>
        Bloque
      </Button>
    );

    await user.click(screen.getByRole('button', { name: 'Bloque' }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
