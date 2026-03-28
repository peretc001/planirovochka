'use client'

import React from 'react'

import { useMatchMedia } from '@/lib/useMatchMedia'

import Filter from '@/modules/home/filter'
import FilterMobile from '@/modules/home/filterMobile/filterMobile'
import List from '@/modules/home/list'

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
