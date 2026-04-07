'use client'

import React from 'react'

import { useMatchMedia } from '@/lib/useMatchMedia'

import Filter from '@/modules/catalog/search/filter'
import FilterMobile from '@/modules/catalog/search/filterMobile/filterMobile'
import List from '@/modules/catalog/search/list'

import styles from './home.module.scss'

const Home = () => {
  const { isMobileMD } = useMatchMedia()

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        {isMobileMD ? <FilterMobile /> : null}
        <Filter />
        <List />
      </div>
    </div>
  )
}

export default Home
