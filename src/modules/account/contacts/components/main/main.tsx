'use client'

import React, { FC } from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getContactsApi } from '@/modules/account/contacts/api/getContactsApi'
import ContactsForm from '@/modules/account/contacts/components/contactsForm/contactsForm'

import styles from './main.module.scss'

interface IMain {
  readonly userId: string | undefined
}

const Main: FC<IMain> = ({ userId }) => {
  const { isFetching, data } = useQuery({
    queryFn: getContactsApi,
    queryKey: ['contacts', userId]
  })

  const { contacts } = data || {}

  return (
    <div className={styles.root}>
      {isFetching ? <Loader isFull /> : <ContactsForm contacts={contacts} />}
    </div>
  )
}

export default Main
