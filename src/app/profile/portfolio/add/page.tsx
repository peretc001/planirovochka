import React from 'react'

import Add from '@/modules/profile/portfolio/add'

export const metadata: Metadata = {
  title: 'Добавить объект | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <Add />

export default Page
