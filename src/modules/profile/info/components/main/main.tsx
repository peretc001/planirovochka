'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getProfileApi } from '@/modules/profile/info/api/getProfileApi'
import ProfileForm from '@/modules/profile/info/components/profileForm/profileForm'

import styles from './main.module.scss'

const Main = () => {
  const { isLoading, data } = useQuery({
    queryFn: getProfileApi,
    queryKey: ['profile_info']
  })

  return (
    <div className={styles.root}>
      {isLoading ? <Loader isFull /> : <ProfileForm profile={data} />}
    </div>
  )
}

export default Main
