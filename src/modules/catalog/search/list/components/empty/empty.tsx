import React from 'react'
import { useTranslations } from 'next-intl'

import { paths } from '@/constants'

import styles from './empty.module.scss'

const Empty = () => {
  const t = useTranslations('home')

  return (
    <div className={styles.root}>
      <div>{t('empty')}</div>
      <a href={paths.home}>{t('reset')}</a>
    </div>
  )
}

export default Empty
