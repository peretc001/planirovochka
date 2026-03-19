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
          <div className={styles.title}>
            <div className={styles.caption}>{process.env.NEXT_PUBLIC_NAME}</div>
            <div className={styles.description}>{process.env.NEXT_PUBLIC_DESCRIPTION}</div>
          </div>
        </Link>

        <Auth isAuth={!!user?.id} />
      </div>
    </div>
  )
}

export default Header
