import React, { FC } from 'react'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

import { IUser } from '@/shared/interfaces'

import styles from './userForm.module.scss'

interface IUserForm {
  readonly user: IUser | null
}

const UserForm: FC<IUserForm> = ({ user }) => {
  const t = useTranslations('profile')

  return (
    <div className={styles.root}>
      <h2>{t('user.title')}</h2>

      <div className={styles.email}>
        <label htmlFor="">{t('user.email.label')}:</label>
        <div className={styles.value}>{user?.email}</div>
      </div>

      <Button type="primary">{t('user.change')}</Button>
    </div>
  )
}

export default UserForm
