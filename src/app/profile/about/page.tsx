import React from 'react'

import About from '@/modules/profile/about'

export const metadata: Metadata = {
  title: 'О себе | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <About />

export default Page
