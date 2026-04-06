'use client'

import React, { FC, useCallback, useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslations } from 'next-intl'

import { IUser } from '@/shared/interfaces'

import { useMatchMedia } from '@/lib/useMatchMedia'

import ChangePassword from '@/modules/profile/user/components/changePassword/changePassword'

import styles from './userForm.module.scss'

interface IUserForm {
  readonly user: IUser | null
}

const UserForm: FC<IUserForm> = ({ user }) => {
  const t = useTranslations('profile')

  const { isMobileMD } = useMatchMedia()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const hideModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleChangePassword = () => {
    setIsModalOpen(true)
  }

  return (
    <div className={styles.root}>
      <h2>{t('user.title')}</h2>

      <div className={styles.email}>
        <label htmlFor="">{t('user.email.label')}:</label>
        <div className={styles.value}>{user?.email}</div>
      </div>

      <Button type="primary" onClick={handleChangePassword}>
        {t('user.change.title')}
      </Button>

      {isModalOpen ? (
        <Modal
          className={styles.modal}
          footer={null}
          open={isModalOpen}
          width={isMobileMD ? '100%' : '450px'}
          onCancel={hideModal}
        >
          <ChangePassword actionClose={hideModal} />
        </Modal>
      ) : null}
    </div>
  )
}

export default UserForm
