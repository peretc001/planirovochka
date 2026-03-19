import React from 'react'

import Prices from '@/modules/profile/prices'

export const metadata: Metadata = {
  title: 'Цены | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <Prices />

export default Page
