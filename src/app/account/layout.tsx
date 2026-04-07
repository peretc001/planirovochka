import React from 'react'
import { getTranslations } from 'next-intl/server'

import Menu from '@/modules/account/menu/menu'

import styles from './layout.module.scss'

const ProfileLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const t = await getTranslations('profile')

  return (
    <div className={styles.root}>
      <Menu />

      {children}
    </div>
  )
}

export default ProfileLayout
