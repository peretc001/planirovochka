'use client'

import React from 'react'

import { useMatchMedia } from '@/lib/useMatchMedia'

import Beta from '@/modules/home/beta/beta'
import Filter from '@/modules/home/filter'
import FilterMobile from '@/modules/home/filterMobile/filterMobile'
import List from '@/modules/home/list'

import styles from './home.module.scss'

const Home = () => {
  const { isMobileMD } = useMatchMedia()

  return (
    <div className={styles.root}>
      <Beta />

      <div className={styles.wrapper}>
        {isMobileMD ? <FilterMobile /> : null}
        <Filter />
        <List />
      </div>
    </div>
  )
}

export default Home
