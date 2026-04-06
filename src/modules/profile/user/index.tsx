import React from 'react'

import { getUserApi } from '@/modules/profile/user/api/getUserApi'
import Main from '@/modules/profile/user/components/main/main'

const Info = async () => {
  const user = await getUserApi()

  return <Main user={user} />
}

export default Info
