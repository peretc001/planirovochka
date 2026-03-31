import serverApi from '@/lib/serverApi'

export const addPortfolioApi = async ({
  description,
  photos,
  price,
  title,
  type
}: {
  description: string
  photos: File[]
  price: string
  title: string
  type: string
}) => {
  const formData = new FormData()

  for (const file of photos) {
    formData.append('photos', file)
  }
  formData.append('description', description ?? '')
  formData.append('price', price ?? '')
  formData.append('title', title ?? '')
  formData.append('type', type ?? '')

  const response = await serverApi.file('profile/portfolio', formData)

  if (!response?.status) {
    throw new Error(typeof response?.error === 'string' ? response.error : 'Upload failed')
  }

  return response.status
}
