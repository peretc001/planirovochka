'use client'

import React from 'react'
import { Button } from 'antd'
import { redirect } from 'next/navigation'

import { paths } from '@/constants'

import { removeToken } from '@/lib/cookie'
import { openSignupModal } from '@/lib/openSignupModal'

import styles from './header.module.scss'

const Header = () => {
  const handleSignup = () => {
    const actionSuccess = () => () => {
      redirect(paths.profile.index)
    }

    openSignupModal(actionSuccess)
  }

  const handleLogout = () => {
    removeToken()
    redirect('/')
  }

  return (
    <div className={styles.root}>
      <Button onClick={handleSignup}>signup</Button>
      <Button onClick={handleLogout}>logout</Button>
    </div>
  )
}

export default Header
