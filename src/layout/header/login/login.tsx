'use client'

import React from 'react'
import { Button } from 'antd'

import { openSignupModal } from '@/lib/openSignupModal'

const Login = () => {
  const handleSignup = () => {
    const actionSuccess = () => () => {
      // TODO: подумать, может заменить потом
      setTimeout(() => window.location.reload(), 1000)
    }

    openSignupModal(actionSuccess)
  }

  return <Button onClick={handleSignup}>signup</Button>
}

export default Login
