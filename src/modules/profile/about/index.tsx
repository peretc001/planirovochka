import React from 'react'

import { getCurrentUser } from '@/lib/getCurrentUser'

import Main from '@/modules/profile/about/components/main/main'

const About = async () => {
  const user = await getCurrentUser()

  return <Main userId={user?.id} />
}

export default About
