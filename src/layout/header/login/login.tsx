'use client'

import React from 'react'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

import { openSignupModal } from '@/lib/openSignupModal'

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
      {t('account')}
    </Button>
  )
}

export default Login
