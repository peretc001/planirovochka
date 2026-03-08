'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getUserApi } from '@/modules/profile/user/api/getUserApi'
import UserForm from '@/modules/profile/user/components/userForm/userForm'

import styles from './main.module.scss'

const Main = () => {
  const { isLoading, data } = useQuery({
    queryFn: getUserApi,
    queryKey: ['user']
  })

  return (
    <div className={styles.root}>{isLoading ? <Loader isFull /> : <UserForm user={data} />}</div>
  )
}

export default Main
