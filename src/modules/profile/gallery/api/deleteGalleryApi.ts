import serverApi from '@/lib/serverApi'

export const deleteGalleryApi = async (id: number) => {
  const response = await serverApi.delete('profile/gallery', { id })

  if (!response?.status) {
    throw new Error(
      typeof response?.error === 'string' ? response.error : 'Delete failed'
    )
  }

  return response.status as boolean
}
