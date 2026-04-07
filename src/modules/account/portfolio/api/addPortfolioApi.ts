import serverApi from '@/lib/serverApi'

export const addPortfolioApi = async ({
  description,
  file,
  photos,
  price,
  title,
  type
}: {
  description: string
  file?: File | null
  photos: File[]
  price: string
  title: string
  type: string
}) => {
  const formData = new FormData()

  for (const photo of photos) {
    formData.append('photos', photo)
  }
  if (file) {
    formData.append('file', file)
  }
  formData.append('description', description ?? '')
  formData.append('price', price ?? '')
  formData.append('title', title ?? '')
  formData.append('type', type ?? '')

  const response = await serverApi.file('account/portfolio', formData)

  if (!response?.status) {
    throw new Error(typeof response?.error === 'string' ? response.error : 'Upload failed')
  }

  return response.status
}
