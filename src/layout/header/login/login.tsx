'use client'

import React from 'react'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

import { UserIcon } from '@heroicons/react/24/outline'

import { openSignupModal } from '@/lib/openSignupModal'

import styles from './login.module.scss'

const Login = () => {
  const t = useTranslations('header')

  const handleSignup = () => {
    const actionSuccess = () => () => {
      // TODO: подумать, может заменить потом
      setTimeout(() => window.location.reload(), 1000)
    }

    openSignupModal(actionSuccess)
  }

  return (
    <Button type="primary" onClick={handleSignup}>
      <UserIcon className={styles.icon} />
      <div className={styles.text}>{t('account')}</div>
    </Button>
  )
}

export default Login
