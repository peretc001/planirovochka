import React, { Suspense } from 'react'
import { Metadata } from 'next'

import Home from '@/modules/home'

export const metadata: Metadata = {
  description:
    process.env.NEXT_PUBLIC_DESCRIPTION +
    ' | Все дизайнеры интерьера в одном месте. Поиск по городу, стилю, опыту, фото',
  title: process.env.NEXT_PUBLIC_NAME + ' | Сервис подбора дизайнера интерьера'
}

const Page = () => (
  <Suspense>
    <Home />
  </Suspense>
)

export default Page
