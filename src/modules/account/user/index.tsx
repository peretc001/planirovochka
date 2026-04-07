import React from 'react'

import { getUserApi } from '@/modules/account/user/api/getUserApi'
import Main from '@/modules/account/user/components/main/main'

const User = async () => {
  const user = await getUserApi()

  return <Main user={user} />
}

export default User
