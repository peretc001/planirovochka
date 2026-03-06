import React from 'react'

import Filter from '@/modules/home/filter'
import List from '@/modules/home/list'

import styles from './home.module.scss'

const Home = () => (
  <div className={styles.root}>
    <Filter />
    <List />
  </div>
)

export default Home
