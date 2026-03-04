import React, { FC, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import { signinApi } from '@/modals/authModal/api/signinApi'

import styles from './signin.module.scss'

interface ISigninPage {
  readonly actionClose: () => void
  readonly actionSuccess?: () => void
}

const SigninPage: FC<ISigninPage> = ({ actionClose, actionSuccess }) => {
  const t = useTranslations('auth')

  const [form] = Form.useForm()

  const handleSuccess = () => {
    actionClose()
    if (actionSuccess) actionSuccess()
  }

  const { isLoading, mutate: save } = useMutation({
    mutationFn: (values: any) => signinApi(values),
    onError: () => message.error(t('status.error')),
    onSuccess: status => {
      if (status) {
        handleSuccess()
      } else {
        message.error(t('status.empty'))
      }
    }
  })

  return (
    <div className={styles.root}>
      <Form className={styles.form} form={form} layout="vertical" name="signup" onFinish={save}>
        <Form.Item
          label={t('email.label')}
          name="email"
          rules={[
            { message: t('email.require'), required: true },
            { message: t('email.validate'), type: 'email' }
          ]}
        >
          <Input placeholder={t('email.placeholder')} type="email" />
        </Form.Item>

        <Form.Item
          className={styles.password}
          label={t('password.label')}
          name="password"
          rules={[
            { message: t('password.require'), required: true },
            { message: t('password.validate'), min: 8 }
          ]}
        >
          <Input.Password placeholder={t('password.placeholder')} />
        </Form.Item>

        <Button className={styles.submit} htmlType="submit" loading={isLoading} type="primary">
          {t('confirm')}
        </Button>
      </Form>
    </div>
  )
}

export default SigninPage
