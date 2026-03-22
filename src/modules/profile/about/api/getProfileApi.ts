export const getProfileApi = async () => {
  try {
    const response = await fetch('/api/profile/about', { credentials: 'include' })

    if (!response.ok) {
      return null
    }

    const json = (await response.json()) as { data?: Record<string, unknown> | null }

    return json.data ?? null
  } catch {
    return null
  }
}
