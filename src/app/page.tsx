import React, { Suspense } from 'react'

import Home from '@/modules/home'

const Page = () => (
  <Suspense>
    <Home />
  </Suspense>
)

export default Page
