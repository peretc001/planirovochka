import serverApi from '@/lib/serverApi'

export const deleteGalleryApi = async (id: number) => {
  try {
    const response = await serverApi.post('profile/gallery/delete.php', {
      id
    })

    return response?.status
  } catch (err: any) {
    console.log('deleteGalleryApi', err)

    throw new Error(err)
  }
}
