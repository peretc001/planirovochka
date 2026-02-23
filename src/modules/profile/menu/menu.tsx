'use client'

import { useEffect, useRef } from 'react'
import cns from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { paths } from '@/constants'

import styles from './menu.module.scss'

import {
  CalendarDaysIcon,
  CreditCardIcon,
  ListBulletIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

const Menu = () => {
  const t = useTranslations('profile')

  const menuRef = useRef<HTMLDivElement | null>(null)

  const pathname = usePathname()

  // скролл активной вкладки
  useEffect(() => {
    if (menuRef.current) {
      const active = menuRef.current?.querySelector(`[aria-label="${pathname}"]`)
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [pathname])

  return (
    <div ref={menuRef} className={styles.root}>
      <div className={styles.wrapper}>
        <Link
          className={cns(styles.item, pathname === paths.profile.index && styles.active)}
          aria-label={paths.profile.index}
          href={paths.profile.index}
        >
          <UserCircleIcon className={styles.icon} />
          {t('menu.index')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.profile.about && styles.active)}
          aria-label={paths.profile.about}
          href={paths.profile.about}
        >
          <CalendarDaysIcon className={styles.icon} />
          {t('menu.about')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.profile.portfolio && styles.active)}
          aria-label={paths.profile.portfolio}
          href={paths.profile.portfolio}
        >
          <ListBulletIcon className={styles.icon} />
          {t('menu.portfolio')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.profile.payment && styles.active)}
          aria-label={paths.profile.payment}
          href={paths.profile.payment}
        >
          <CreditCardIcon className={styles.icon} />
          {t('menu.payment')}
        </Link>
      </div>
    </div>
  )
}

export default Menu
