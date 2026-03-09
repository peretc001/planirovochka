import React, { FC } from 'react'
import { Form, Input } from 'antd'
import { useTranslations } from 'next-intl'

import { IUser } from '@/shared/interfaces'

import styles from './userForm.module.scss'

interface IUserForm {
  readonly user: IUser
}

const UserForm: FC<IUserForm> = ({ user }) => {
  const t = useTranslations('auth')

  const [form] = Form.useForm()

  return (
    <Form className={styles.root} form={form} initialValues={user} layout="vertical" name="user">
      <Form.Item label={t('email.label')} name="email">
        <Input disabled placeholder={t('email.placeholder')} />
      </Form.Item>
    </Form>
  )
}

export default UserForm
