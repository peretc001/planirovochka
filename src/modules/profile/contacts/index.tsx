import React from 'react'

import { getCurrentUser } from '@/lib/getCurrentUser'

import Main from '@/modules/profile/contacts/components/main/main'

const Contacts = async () => {
  const user = await getCurrentUser()

  return <Main userId={user?.id} />
}

export default Contacts
