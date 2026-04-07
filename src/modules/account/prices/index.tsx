import React from 'react'

import { getCurrentUser } from '@/lib/getCurrentUser'

import Main from '@/modules/account/prices/components/main/main'

const Prices = async () => {
  const user = await getCurrentUser()

  return <Main userId={user?.id} />
}

export default Prices
