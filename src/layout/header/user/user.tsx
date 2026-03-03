'use client'

import { FC } from 'react'
import { Dropdown, MenuProps } from 'antd'
import cns from 'classnames'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { IUser } from '@/shared/interfaces'

import { paths } from '@/constants'

import { removeToken } from '@/lib/cookie'

import styles from './user.module.scss'

interface IUserMenu {
  readonly user: IUser | null
}

const User: FC<IUserMenu> = ({ user }) => {
  const t = useTranslations('profile')

  const { name } = user || {}

  const handleLogout = () => {
    removeToken()
    // TODO: подумать, может заменить потом
    window.location.reload()
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link href={paths.profile.index}>{t('menu.index')}</Link>
    },
    {
      type: 'divider'
    },
    {
      key: '6',
      label: 'Выйти',
      onClick: handleLogout
    }
  ]

  return (
    <div className={cns(styles.root, !user && styles.loading)}>
      {user ? (
        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
          <div className={styles.user}>
            <div className={styles.avatar} />

            <div className={styles.drop}>
              <ChevronDownIcon className={styles.icon} />
            </div>
            {name ? <div className={styles.name}>{name}</div> : null}
          </div>
        </Dropdown>
      ) : null}
    </div>
  )
}

export default User
