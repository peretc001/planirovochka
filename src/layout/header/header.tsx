import React from 'react'
import Link from 'next/link'

import { jwtPayloadToUser, verifyJwtOnServer } from '@/lib/verifyJwtOnServer'

import Auth from '@/layout/header/auth/auth'

import styles from './header.module.scss'

const Header = async () => {
  const payload = await verifyJwtOnServer()
  const user = jwtPayloadToUser(payload)

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Link className={styles.logo} href="/">
          <img alt="" src="/logo.png" />
        </Link>

        <Auth isAuth={!!user?.id} />
      </div>
    </div>
  )
}

export default Header
