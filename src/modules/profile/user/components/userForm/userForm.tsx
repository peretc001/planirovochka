import React, { FC } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import FileUpload from '@/shared/components/fileUpload/fileUpload'
import Loader from '@/shared/components/loader/loader'

import { addInfoApi } from '@/modules/profile/user/api/addInfoApi'

import styles from './userForm.module.scss'

interface IUserForm {
  readonly profile: any
}

const UserForm: FC<IUserForm> = ({ profile }) => {
  const t = useTranslations('profile')

  const [form] = Form.useForm()

  const { isLoading, mutate: save } = useMutation({
    mutationFn: (values: any) => addInfoApi(values),
    onError: () => message.error(t('error')),
    onSuccess: status => (status ? message.success(t('success')) : message.error(t('error')))
  })

  const onFinish = async (values: any) => {
    await save(values)
  }

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={profile}
      layout="vertical"
      name="info"
      onFinish={onFinish}
    >
      {isLoading ? <Loader isFull /> : null}

      <div className={styles.avatar}>
        <Form.Item name="avatar">
          <FileUpload form={form} />
        </Form.Item>
        <p>{t('info.avatar')}</p>
      </div>

      <Form.Item>
        <Button htmlType="submit" type="primary">
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default UserForm
