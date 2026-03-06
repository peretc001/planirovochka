'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

import { useMatchMedia } from '@/lib/useMatchMedia'

import City from '@/modules/home/filter/components/city'
import Groups from '@/modules/home/filter/components/groups'
import Name from '@/modules/home/filter/components/name'

import styles from './filter.module.scss'

const Filter = () => {
  const t = useTranslations('filter')

  const { isMobile } = useMatchMedia()

  return (
    <div className={styles.root}>
      {isMobile ? <div className={styles.mobile}>{t('description')}</div> : null}

      <div className={styles.wrapper}>
        <Name />
        <City />
        <Groups />
      </div>
    </div>
  )
}

export default Filter
