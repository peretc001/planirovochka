import React from 'react'
import { getTranslations } from 'next-intl/server'

import Menu from '@/modules/profile/menu/menu'

import styles from './layout.module.scss'

const ProfileLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const t = await getTranslations('profile')

  return (
    <div className={styles.root}>
      <h1>{t('title')}</h1>

      <div className={styles.container}>
        <Menu />

        {children}
      </div>
    </div>
  )
}

export default ProfileLayout
