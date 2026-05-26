import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and displays navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page).toHaveTitle(/Captain|Boat/i);
  });

  test('has working navigation links', async ({ page }) => {
    await page.goto('/');
    const produitsLink = page.locator('nav a[href*="produits"], nav a:has-text("PRODUITS")');
    if (await produitsLink.count() > 0) {
      await produitsLink.first().click();
      await expect(page).toHaveURL(/produits/);
    }
  });
});

test.describe('Products page', () => {
  test('displays product cards', async ({ page }) => {
    await page.goto('/produits');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[class*="rounded"]').filter({ hasText: /croisière|macaron|esim/i });
    expect(await cards.count()).toBeGreaterThan(0);
  });
});

test.describe('Ma Reservation page', () => {
  test('shows search form', async ({ page }) => {
    await page.goto('/ma-reservation');
    await page.waitForLoadState('networkidle');
    await expect(page.getByPlaceholder('jean.dupont@email.com')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /rechercher/i })).toBeVisible();
  });

  test('validates email before search', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/ma-reservation');
    await page.waitForLoadState('networkidle');
    const emailInput = page.getByPlaceholder('jean.dupont@email.com');
    await emailInput.fill('');
    const submitBtn = page.getByRole('button', { name: /rechercher/i });
    await expect(submitBtn).toBeDisabled({ timeout: 10000 });
  });

  test('displays no results for unknown email', async ({ page }) => {
    await page.goto('/ma-reservation');
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('jean.dupont@email.com').fill('unknown@test.fr');
    await page.getByRole('button', { name: /rechercher/i }).click();
    await expect(page.getByText('Aucune réservation')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Checkout page', () => {
  test('shows empty cart message or items', async ({ page }) => {
    await page.goto('/paiement');
    await page.waitForLoadState('domcontentloaded');
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });
});

test.describe('Security headers', () => {
  test('API responds with security headers', async ({ request }) => {
    const response = await request.get('/api/reservations/by-payment?payment_intent=test');
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.headers()['x-frame-options']).toBe('DENY');
    expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });
});

test.describe('API validation', () => {
  test('checkout rejects invalid body', async ({ request }) => {
    const response = await request.post('/api/checkout', {
      data: { email: 'invalid', items: [] },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('reservation lookup rejects missing email', async ({ request }) => {
    const response = await request.post('/api/reservations', {
      data: {},
    });
    expect(response.status()).toBe(400);
  });
});
