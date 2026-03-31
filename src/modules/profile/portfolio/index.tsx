import React from 'react'

import { getCurrentUser } from '@/lib/getCurrentUser'

import Main from '@/modules/profile/portfolio/components/main/main'

const Portfolio = async () => {
  const user = await getCurrentUser()

  return <Main userId={user?.id} />
}

export default Portfolio
