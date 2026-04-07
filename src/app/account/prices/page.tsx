import React from 'react'
import { Metadata } from 'next'

import Prices from '@/modules/account/prices'

export const metadata: Metadata = {
  title: 'Цены | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <Prices />

export default Page
