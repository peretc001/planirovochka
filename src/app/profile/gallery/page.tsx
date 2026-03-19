import React from 'react'
import { Metadata } from 'next'

import Gallery from '@/modules/profile/gallery'

export const metadata: Metadata = {
  title: 'Галерея | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <Gallery />

export default Page
