import { expect, test } from '@playwright/test';

test.describe('Crystal Swipe e2e', () => {
  test('completes quiz flow from home to results', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Commencer le swipe' }).click();
    await expect(page).toHaveURL(/\/swipe$/);

    for (let step = 0; step < 20; step += 1) {
      await page.getByRole('button', { name: 'Oui' }).click();
    }

    await expect(page).toHaveURL(/\/results$/);
    await expect(page.getByRole('heading', { name: 'Ton Match Energetique' })).toBeVisible();
    await expect(page.getByText('% match').first()).toBeVisible();
  });

  test('handles history pagination and clear action', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const makeHistoryEntry = (id: string, stoneName: string, percentage: number, icon: string) => ({
        id,
        completedAt: '2026-05-17T12:00:00.000Z',
        matches: [
          {
            stone: {
              id: stoneName.toLowerCase().replace(/\s+/g, '-'),
              name: stoneName,
              icon,
            },
            percentage,
          },
        ],
      });

      localStorage.setItem(
        'swipeHistory',
        JSON.stringify([
          makeHistoryEntry('history-0', 'Tourmaline Noire', 90, '/pierres/tourmaline-noire.png'),
          makeHistoryEntry('history-1', 'Labradorite', 80, '/pierres/labradorite.png'),
          makeHistoryEntry('history-2', 'Aigue-marine', 70, '/pierres/aigue-marine.png'),
        ])
      );

      localStorage.setItem(
        'swipeSession',
        JSON.stringify({
          id: 'history-0',
          completedAt: '2026-05-17T12:00:00.000Z',
          results: [{ questionId: '1', liked: true }],
        })
      );
    });

    await page.goto('/results');

    await expect(page.getByText('Page 1 / 2')).toBeVisible();
    await expect(page.locator('.results__history-item')).toHaveCount(2);

    await page.getByRole('button', { name: 'Page suivante' }).click();
    await expect(page.getByText('Page 2 / 2')).toBeVisible();
    await expect(page.locator('.results__history-item')).toHaveCount(1);

    await page.getByRole('button', { name: "Effacer l'historique" }).click();
    await expect(page.getByRole('heading', { name: 'Historique' })).toHaveCount(0);
  });

  test('opens stone detail page', async ({ page }) => {
    await page.goto('/stones/tourmaline');

    await expect(page.getByRole('heading', { name: 'Tourmaline Noire' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Signification' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Associations' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Labradorite' })).toBeVisible();
  });
});
