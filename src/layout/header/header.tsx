import React from 'react'
import { Tooltip } from 'antd'
import Link from 'next/link'

import { getCurrentUser } from '@/lib/getCurrentUser'

import Auth from '@/layout/header/auth/auth'

import styles from './header.module.scss'

const Header = async () => {
  const user = await getCurrentUser()

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

        <div className={styles.description}>
          <div className={styles.beta}>beta</div>
          <div className={styles.text}>Сервис находится в стадии разработки</div>
        </div>

        <Auth user={user} />
      </div>
    </div>
  )
}

export default Header
