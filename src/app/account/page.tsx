import React from 'react'
import { Metadata } from 'next'

import User from '@/modules/account/user'

export const metadata: Metadata = {
  title: 'Профиль | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <User />

export default Page
