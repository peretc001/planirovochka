'use client'

import React, { FC } from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getGalleryApi } from '@/modules/profile/gallery/api/getGalleryApi'
import List from '@/modules/profile/gallery/components/list/list'

import styles from './main.module.scss'

interface IMain {
  readonly userId: string | undefined
}

const Main: FC<IMain> = ({ userId }) => {
  const { isFetching, data } = useQuery({
    queryFn: getGalleryApi,
    queryKey: ['gallery', userId]
  })

  return (
    <div className={styles.root}>
      {isFetching ? <Loader isFull /> : null}

      <List list={data} />
    </div>
  )
}

export default Main
