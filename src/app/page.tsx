import React from 'react'
import Link from 'next/link'

import { paths } from '@/constants'

const Page = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <Link href="/">Home</Link>
    <Link href={paths.profile.index}>Profile</Link>
  </div>
)

export default Page
