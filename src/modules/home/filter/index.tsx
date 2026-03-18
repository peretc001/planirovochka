'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

import City from '@/modules/home/filter/components/city'
import Groups from '@/modules/home/filter/components/groups'
import Name from '@/modules/home/filter/components/name'

import styles from './filter.module.scss'

const Filter = () => {
  const t = useTranslations('filter')

  return (
    <div className={styles.root}>
      <Name />
      <City />
      <Groups />
    </div>
  )
}

export default Filter
