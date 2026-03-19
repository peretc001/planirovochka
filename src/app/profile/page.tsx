import React from 'react'

import Info from '@/modules/profile/user'

export const metadata: Metadata = {
  title: 'Профиль | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <Info />

export default Page
