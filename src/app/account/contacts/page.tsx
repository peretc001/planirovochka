import React from 'react'
import { Metadata } from 'next'

import Contacts from '@/modules/account/contacts'

export const metadata: Metadata = {
  title: 'Контакты | ' + process.env.NEXT_PUBLIC_NAME
}

const Page = () => <Contacts />

export default Page
