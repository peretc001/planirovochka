export const addProfileApi = async (values: Record<string, unknown>) => {
  try {
    const response = await fetch('/api/profile/about', {
      body: JSON.stringify(values),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    })

    const data = (await response.json()) as { status?: boolean }

    if (!response.ok) {
      return false
    }

    return data?.status === true
  } catch {
    return false
  }
}
