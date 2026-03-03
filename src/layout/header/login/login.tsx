'use client'

import React from 'react'
import { Button } from 'antd'
import { redirect } from 'next/navigation'

import { paths } from '@/constants'

import { openSignupModal } from '@/lib/openSignupModal'

const Login = () => {
  const handleSignup = () => {
    const actionSuccess = () => () => {
      redirect(paths.profile.index)
    }

    openSignupModal(actionSuccess)
  }

  return <Button onClick={handleSignup}>signup</Button>
}

export default Login
