import React, { FC } from 'react'
import Link from 'next/link'

import { IUser } from '@/shared/interfaces'

import { jwtPayloadToUser, verifyJwtOnServer } from '@/lib/verifyJwtOnServer'

import Auth from '@/layout/header/auth/auth'

import styles from './header.module.scss'

interface IHeader {
  readonly user: IUser | null
}

const Header: FC<IHeader> = async () => {
  const payload = await verifyJwtOnServer()
  const user = jwtPayloadToUser(payload)

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Link className={styles.logo} href="/">
          <img alt="" src="/logo.png" />
        </Link>

        <Auth user={user} />
      </div>
    </div>
  )
}

export default Header
