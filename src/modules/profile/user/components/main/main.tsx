'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getProfileApi } from '@/modules/profile/user/api/getProfileApi'
import UserForm from '@/modules/profile/user/components/userForm/userForm'

import styles from './main.module.scss'

const Main = () => {
  const { isLoading, data } = useQuery({
    queryFn: getProfileApi,
    queryKey: ['profile_info']
  })

  return (
    <div className={styles.root}>{isLoading ? <Loader isFull /> : <UserForm profile={data} />}</div>
  )
}

export default Main
