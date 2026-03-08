'use client'

import { FC } from 'react'
import { Dropdown, MenuProps } from 'antd'
import cns from 'classnames'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { useQuery } from '@tanstack/react-query'

import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { paths } from '@/constants'

import { removeToken } from '@/lib/cookie'

import { getUserApi } from '@/modules/profile/user/api/getUserApi'

import styles from './user.module.scss'

const User: FC<IUserMenu> = () => {
  const t = useTranslations('profile')

  const { data: user } = useQuery({
    queryFn: getUserApi,
    queryKey: ['user']
  })

  const { avatar, email } = user || {}

  const handleLogout = () => {
    removeToken()
    // TODO: подумать, может заменить потом
    setTimeout(() => window.location.reload(), 500)
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
            {avatar ? (
              <img className={styles.avatar} alt="" src={process.env.NEXT_PUBLIC_URL + avatar} />
            ) : (
              <div className={styles.avatar} />
            )}

            <div className={styles.drop}>
              <ChevronDownIcon className={styles.icon} />
            </div>
            {email ? <div className={styles.email}>{email}</div> : null}
          </div>
        </Dropdown>
      ) : null}
    </div>
  )
}

export default User
