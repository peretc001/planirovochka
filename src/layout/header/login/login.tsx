'use client'

import React from 'react'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

import { UserIcon } from '@heroicons/react/24/outline'

import { openSignupModal } from '@/lib/openSignupModal'
import { useMatchMedia } from '@/lib/useMatchMedia'

import styles from './login.module.scss'

const Login = () => {
  const t = useTranslations('header')

  const { isMobileMD } = useMatchMedia()

  const handleSignup = () => {
    openSignupModal()
  }

  return (
    <Button type="primary" onClick={handleSignup}>
      {isMobileMD ? <UserIcon className={styles.icon} /> : t('account')}
    </Button>
  )
}

export default Login
