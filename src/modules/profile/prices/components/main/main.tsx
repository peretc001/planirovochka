'use client'

import React, { FC } from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getPricesApi } from '@/modules/profile/prices/api/getPricesApi'
import List from '@/modules/profile/prices/components/list/list'

import styles from './main.module.scss'

interface IMain {
  readonly userId: string | undefined
}

const Main: FC<IMain> = ({ userId }) => {
  const { isFetching, data } = useQuery({
    queryFn: getPricesApi,
    queryKey: ['prices', userId]
  })

  const { prices, types } = data || {}

  return (
    <div className={styles.root}>
      {isFetching ? <Loader isFull /> : <List prices={prices} types={types} />}
    </div>
  )
}

export default Main
