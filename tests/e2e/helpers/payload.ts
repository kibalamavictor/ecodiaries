const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

export async function adminLogin() {
  const res = await fetch(`${baseUrl}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.E2E_ADMIN_EMAIL || 'e2e-admin@ecodiaries.test',
      password: process.env.E2E_ADMIN_PASSWORD || 'E2eAdminPass123!',
    }),
  })
  if (!res.ok) throw new Error(`Admin login failed: ${res.status}`)
  const data = (await res.json()) as { token?: string }
  if (!data.token) throw new Error('No admin token returned')
  return data.token
}

export async function payloadFetch(path: string, token: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
      ...init?.headers,
    },
  })
  return res
}

export async function getNewsletterConfirmToken(email: string, token: string) {
  const res = await payloadFetch(
    `/newsletter-subscribers?where[email][equals]=${encodeURIComponent(email)}&limit=1`,
    token,
  )
  const data = (await res.json()) as { docs?: { confirmToken?: string }[] }
  return data.docs?.[0]?.confirmToken
}

export async function approveContributor(email: string, password: string, adminToken: string) {
  const find = await payloadFetch(
    `/contributors?where[email][equals]=${encodeURIComponent(email)}&limit=1`,
    adminToken,
  )
  const data = (await find.json()) as { docs?: { id: string | number }[] }
  const id = data.docs?.[0]?.id
  if (!id) throw new Error(`Contributor not found: ${email}`)

  await payloadFetch(`/contributors/${id}`, adminToken, {
    method: 'PATCH',
    body: JSON.stringify({ applicationStatus: 'approved', password }),
  })
}

export async function publishStoryBySlug(slug: string, adminToken: string) {
  const find = await payloadFetch(`/stories?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`, adminToken)
  const data = (await find.json()) as { docs?: { id: string | number }[] }
  const id = data.docs?.[0]?.id
  if (!id) throw new Error(`Story not found: ${slug}`)

  await payloadFetch(`/stories/${id}`, adminToken, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'published', publishedAt: new Date().toISOString() }),
  })
}

export { baseUrl }
