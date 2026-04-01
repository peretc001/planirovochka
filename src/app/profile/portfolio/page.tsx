import React from 'react'
import { Metadata } from 'next'

import Portfolio from '@/modules/profile/portfolio'

export const metadata: Metadata = {
  title: 'Портфолио | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <Portfolio />

export default Page
