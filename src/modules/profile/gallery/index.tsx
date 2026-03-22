import React from 'react'

import { getCurrentUser } from '@/lib/getCurrentUser'

import Main from '@/modules/profile/gallery/components/main/main'

const Gallery = async () => {
  const user = await getCurrentUser()

  return <Main userId={user?.id} />
}

export default Gallery
