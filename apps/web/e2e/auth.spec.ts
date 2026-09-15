import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page).toHaveURL('/auth/login');
    await expect(page.locator('h1')).toContainText('Connexion');
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page).toHaveURL('/auth/register');
    await expect(page.locator('h1')).toContainText('Inscription');
  });

  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('a[href="/auth/register"]');
    await expect(page).toHaveURL('/auth/register');
  });

  test('should navigate from register to login', async ({ page }) => {
    await page.goto('/auth/register');
    await page.click('a[href="/auth/login"]');
    await expect(page).toHaveURL('/auth/login');
  });

  test('should show validation errors on register', async ({ page }) => {
    await page.goto('/auth/register');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should show validation errors on login', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth/login');
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should display dashboard', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Tableau de bord');
  });

  test('should display sidebar navigation', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a[href="/dashboard/tasks"]')).toBeVisible();
    await expect(page.locator('a[href="/dashboard/notes"]')).toBeVisible();
    await expect(page.locator('a[href="/dashboard/calendar"]')).toBeVisible();
    await expect(page.locator('a[href="/dashboard/projects"]')).toBeVisible();
  });

  test('should navigate to tasks page', async ({ page }) => {
    await page.click('a[href="/dashboard/tasks"]');
    await expect(page).toHaveURL('/dashboard/tasks');
  });

  test('should navigate to notes page', async ({ page }) => {
    await page.click('a[href="/dashboard/notes"]');
    await expect(page).toHaveURL('/dashboard/notes');
  });

  test('should navigate to calendar page', async ({ page }) => {
    await page.click('a[href="/dashboard/calendar"]');
    await expect(page).toHaveURL('/dashboard/calendar');
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.click('a[href="/dashboard/projects"]');
    await expect(page).toHaveURL('/dashboard/projects');
  });
});

test.describe('Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await page.click('a[href="/dashboard/tasks"]');
    await page.waitForURL('/dashboard/tasks');
  });

  test('should display tasks page', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard/tasks');
    await expect(page.locator('h1')).toContainText('Tâches');
  });

  test('should show create task button', async ({ page }) => {
    await expect(page.locator('button:has-text("Nouvelle tâche")')).toBeVisible();
  });

  test('should open create task modal', async ({ page }) => {
    await page.click('button:has-text("Nouvelle tâche")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });
});

test.describe('Notes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await page.click('a[href="/dashboard/notes"]');
    await page.waitForURL('/dashboard/notes');
  });

  test('should display notes page', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard/notes');
    await expect(page.locator('h1')).toContainText('Notes');
  });

  test('should show create note button', async ({ page }) => {
    await expect(page.locator('button:has-text("Nouvelle note")')).toBeVisible();
  });
});

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await page.click('a[href="/dashboard/calendar"]');
    await page.waitForURL('/dashboard/calendar');
  });

  test('should display calendar page', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard/calendar');
    await expect(page.locator('h1')).toContainText('Calendrier');
  });

  test('should show create event button', async ({ page }) => {
    await expect(page.locator('button:has-text("Nouvel événement")')).toBeVisible();
  });
});

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await page.click('a[href="/dashboard/projects"]');
    await page.waitForURL('/dashboard/projects');
  });

  test('should display projects page', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard/projects');
    await expect(page.locator('h1')).toContainText('Projets');
  });

  test('should show create project button', async ({ page }) => {
    await expect(page.locator('button:has-text("Nouveau projet")')).toBeVisible();
  });
});
