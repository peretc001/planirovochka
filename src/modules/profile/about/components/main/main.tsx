'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getProfileApi } from '@/modules/profile/about/api/getProfileApi'
import AboutForm from '@/modules/profile/about/components/aboutForm/aboutForm'

import styles from './main.module.scss'

const Main = () => {
  const { isLoading, data } = useQuery({
    queryFn: getProfileApi,
    queryKey: ['profile']
  })

  return (
    <div className={styles.root}>
      {isLoading ? <Loader isFull /> : <AboutForm profile={data} />}
    </div>
  )
}

export default Main
