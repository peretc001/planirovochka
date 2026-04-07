import React from 'react'
import { Metadata } from 'next'

import About from '@/modules/account/about'

export const metadata: Metadata = {
  title: 'О себе | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <About />

export default Page
