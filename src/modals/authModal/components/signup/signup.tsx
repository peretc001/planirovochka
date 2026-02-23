import React, { FC, useState } from 'react'
import { Button, Checkbox, CheckboxProps, Form, Input, message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import { signupApi } from '@/modals/authModal/api/signupApi'

import styles from './signup.module.scss'

interface ISignupPage {
  readonly actionClose: () => void
  readonly actionSuccess?: () => void
}

const SignupPage: FC<ISignupPage> = ({ actionClose, actionSuccess }) => {
  const t = useTranslations('auth')

  const [form] = Form.useForm()
  const [checkPolicy, setCheckPolicy] = useState(true)

  const { isLoading, mutate: save } = useMutation({
    mutationFn: (values: any) => signupApi(values),
    onError: () => message.error(t('status.error')),
    onSuccess: status => {
      if (status) actionClose()
      else message.error(t('status.exist'))
    }
  })

  const handleChangePolicy: CheckboxProps['onChange'] = e => {
    setCheckPolicy(e.target.checked)
  }

  const onFinish = async (values: any) => {
    await save(values)
    if (actionSuccess) actionSuccess()
  }

  return (
    <div className={styles.root}>
      <Form className={styles.form} form={form} layout="vertical" name="signup" onFinish={onFinish}>
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

        <Checkbox className={styles.policy} checked={checkPolicy} onChange={handleChangePolicy}>
          {t.rich('policy', {
            a: chunks => (
              <a href="/policy" target="_blank">
                {chunks}
              </a>
            )
          })}
        </Checkbox>

        <Button
          className={styles.submit}
          disabled={!checkPolicy}
          htmlType="submit"
          loading={isLoading}
          type="primary"
        >
          {t('submit')}
        </Button>
      </Form>
    </div>
  )
}

export default SignupPage
