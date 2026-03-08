import React, { FC } from 'react'
import { Form, Input } from 'antd'
import { useTranslations } from 'next-intl'

import FileUpload from '@/shared/components/fileUpload/fileUpload'
import { IUser } from '@/shared/interfaces'

import styles from './userForm.module.scss'

interface IUserForm {
  readonly user: IUser
}

const UserForm: FC<IUserForm> = ({ user }) => {
  const t = useTranslations('profile')
  const t1 = useTranslations('auth')

  const [form] = Form.useForm()

  return (
    <Form className={styles.root} form={form} initialValues={user} layout="vertical" name="user">
      <div className={styles.avatar}>
        <Form.Item name="avatar">
          <FileUpload form={form} />
        </Form.Item>
        <p>{t('info.avatar')}</p>
      </div>

      <Form.Item label={t1('email.label')} name="email">
        <Input disabled placeholder={t1('email.placeholder')} />
      </Form.Item>
    </Form>
  )
}

export default UserForm
