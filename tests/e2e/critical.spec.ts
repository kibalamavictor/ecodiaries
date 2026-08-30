import { test, expect } from '@playwright/test'
import {
  adminLogin,
  approveContributor,
  getNewsletterConfirmToken,
  publishStoryBySlug,
} from './helpers/payload'

const contributorPassword = process.env.E2E_CONTRIBUTOR_PASSWORD || 'E2eContributorPass123!'

test.describe('EcoDiaries critical paths', () => {
  test('homepage loads magazine layout', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).first()).toBeVisible()
    const nav = page.getByRole('navigation', { name: 'Main navigation' }).first()
    await expect(nav.getByRole('link', { name: 'Solutions' })).toBeVisible()
  })

  test('stories archive loads', async ({ page }) => {
    await page.goto('/stories')
    await expect(page.locator('h1.sr-only')).toHaveText('Stories')
    await expect(page.getByRole('heading', { name: 'Trending now' })).toBeVisible()
  })

  test('legal pages exist and footer links work', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Privacy Policy' }).click()
    await expect(page).toHaveURL(/\/privacy/)
    await expect(page.locator('h1')).toContainText('Privacy Policy')
  })

  test('contact form submits', async ({ page, request }) => {
    const adminToken = await adminLogin()
    await page.goto('/contact')
    await page.fill('#contact-name', 'Test User')
    await page.fill('#contact-email', 'test-contact@example.com')
    await page.getByTestId('contributor-continue').click()
    await page.getByTestId('contributor-continue').click()
    await page.fill('#contact-message', 'This is a test message from Playwright.')
    await page.getByTestId('contributor-continue').click()
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/contact') && r.request().method() === 'POST'),
      page.getByRole('button', { name: 'Send message' }).click(),
    ])
    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.emailAttempted).toBe(true)
    await expect(page.getByText(/sent|Message sent/i)).toBeVisible({ timeout: 15000 })

    const res = await request.get('/api/contact-submissions?limit=5&sort=-createdAt', {
      headers: { Authorization: `JWT ${adminToken}` },
    })
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    const match = data.docs?.find((d: { email?: string }) => d.email === 'test-contact@example.com')
    expect(match).toBeTruthy()
  })

  test('newsletter signup through confirmation', async ({ page, request }) => {
    const email = `newsletter-${Date.now()}@example.com`
    const adminToken = await adminLogin()

    await page.goto('/contact')
    await page.locator('.cta-form input[name="email"]').fill(email)
    await page.locator('.cta-form button[type="submit"]').click()
    await expect(page.getByText(/confirm your subscription/i)).toBeVisible({ timeout: 15000 })
    await page.getByRole('button', { name: 'Confirm subscription' }).click()
    await expect(page.getByText(/Check your email/i).first()).toBeVisible({ timeout: 15000 })

    const token = await getNewsletterConfirmToken(email, adminToken)
    expect(token).toBeTruthy()

    await page.goto(`/api/newsletter/confirm?token=${token}&email=${encodeURIComponent(email)}`)
    await expect(page).toHaveURL(/newsletter=confirmed/)
  })

  test('contributor application and story publish flow', async ({ page, request }) => {
    test.setTimeout(120_000)
    const email = `contributor-${Date.now()}@example.com`
    const storySlug = `e2e-story-${Date.now()}`
    const adminToken = await adminLogin()

    await page.goto('/contributors#apply')

    // Step 1 — basic info
    await page.getByTestId('contributor-name').fill('E2E Flow Contributor')
    await page.getByTestId('contributor-email').fill(email)
    await page.getByTestId('contributor-region').fill('Kampala, Uganda')
    await page
      .getByTestId('contributor-bio')
      .fill('Climate journalist based in Kampala covering water and agriculture for e2e testing.')
    await page.getByTestId('contributor-continue').click()

    // Step 2 — contribution type
    await page.getByRole('button', { name: 'Writer' }).click()
    await page.getByTestId('contributor-continue').click()

    // Step 3 — type-specific details + square photo crop
    await page.getByPlaceholder('https://...').fill('https://example.com/writing-sample')
    await page.getByPlaceholder('e.g. Agriculture').fill('Water')
    await page.getByTestId('contributor-photo-input').setInputFiles('tests/e2e/fixtures/contributor-photo.jpg')
    await page.getByTestId('contributor-photo-apply-crop').click()
    await page.getByTestId('contributor-continue').click()

    // Step 4 — review & submit
    await page.getByTestId('contributor-submit').click()
    await expect(page.getByText(/Application received/i)).toBeVisible({ timeout: 15000 })

    await approveContributor(email, contributorPassword, adminToken)

    await page.goto('/dashboard/login')
    await page.fill('#email', email)
    await page.fill('#password', contributorPassword)
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: 'Contributor Dashboard' })).toBeVisible({ timeout: 15000 })

    await page.goto('/dashboard/stories/new')
    await expect(page.locator('#title')).toBeVisible({ timeout: 15000 })
    await page.fill('#title', 'E2E Published Story')
    await page.fill('#slug', storySlug)
    await page.fill('#excerpt', 'An automated end-to-end test story.')
    await page.fill('#body', 'First paragraph of the test story.\n\nSecond paragraph with more detail.')
    await page.click('button[value="true"]')
    await expect(page.getByRole('heading', { name: 'Contributor Dashboard' })).toBeVisible({ timeout: 15000 })

    await publishStoryBySlug(storySlug, adminToken)

    await page.goto(`/stories/${storySlug}`)
    await expect(page.locator('h1')).toContainText('E2E Published Story')
  })

  test('search returns seeded story', async ({ page }) => {
    await page.goto('/stories?q=Northern+Uganda')
    await expect(
      page.getByRole('heading', { name: /Northern Uganda/i }).filter({ visible: true }).first(),
    ).toBeVisible({ timeout: 10000 })
  })

  test('category filter on stories', async ({ page }) => {
    await page.goto('/stories?category=water')
    await expect(
      page.getByRole('heading', { name: /Northern Uganda/i }).filter({ visible: true }).first(),
    ).toBeVisible({ timeout: 10000 })
  })

  test('category filter on solutions', async ({ page }) => {
    await page.goto('/solutions?category=water')
    await expect(
      page.getByRole('heading', { name: /Cooperative Well/i }).filter({ visible: true }).first(),
    ).toBeVisible({
      timeout: 10000,
    })
  })

  test('main nav lists Solutions before Stories and omits Watch and Listen', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main navigation' }).first()
    const labels = (await nav.getByRole('link').allTextContents()).map((t) => t.trim())
    const solutions = labels.indexOf('Solutions')
    const stories = labels.indexOf('Stories')
    expect(solutions).toBeGreaterThanOrEqual(0)
    expect(stories).toBeGreaterThan(solutions)
    expect(labels).not.toContain('Watch')
    expect(labels).not.toContain('Listen')
  })
})
