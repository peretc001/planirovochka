import serverApi from '@/lib/serverApi'

export const getGalleryApi = async () => {
  try {
    const response = await serverApi.get('account/gallery')

    return response?.data
  } catch (err) {
    console.log('getGalleryApi', err)

    return null
  }
}
