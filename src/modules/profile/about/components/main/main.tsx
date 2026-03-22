'use client'

import React, { FC } from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getProfileApi } from '@/modules/profile/about/api/getProfileApi'
import AboutForm from '@/modules/profile/about/components/aboutForm/aboutForm'

import styles from './main.module.scss'

interface IMain {
  readonly userId: string | undefined
}

const Main: FC<IMain> = ({ userId }) => {
  const { isLoading, data } = useQuery({
    queryFn: getProfileApi,
    queryKey: ['profile', userId]
  })

  return (
    <div className={styles.root}>
      {isLoading ? <Loader isFull /> : <AboutForm profile={data} />}
    </div>
  )
}

export default Main
