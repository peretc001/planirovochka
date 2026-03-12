'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import { getGalleryApi } from '@/modules/profile/gallery/api/getGalleryApi'
import List from '@/modules/profile/gallery/components/list/list'

import styles from './main.module.scss'

const Main = () => {
  const { isFetching, data } = useQuery({
    queryFn: getGalleryApi,
    queryKey: ['gallery']
  })

  return (
    <div className={styles.root}>
      <List isLoading={isFetching} list={data} />
    </div>
  )
}

export default Main
