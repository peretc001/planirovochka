'use client'

import { useEffect, useRef } from 'react'
import cns from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import {
  AtSymbolIcon,
  BanknotesIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  PhotoIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

import { paths } from '@/constants'

import styles from './menu.module.scss'

const Menu = () => {
  const t = useTranslations('account')

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
          className={cns(styles.item, pathname === paths.account.index && styles.active)}
          aria-label={paths.account.index}
          href={paths.account.index}
        >
          <UserCircleIcon className={styles.icon} />
          {t('menu.index')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.account.about && styles.active)}
          aria-label={paths.account.about}
          href={paths.account.about}
        >
          <DocumentTextIcon className={styles.icon} />
          {t('menu.about')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.account.prices && styles.active)}
          aria-label={paths.account.prices}
          href={paths.account.prices}
        >
          <BanknotesIcon className={styles.icon} />
          {t('menu.prices')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.account.contacts && styles.active)}
          aria-label={paths.account.contacts}
          href={paths.account.contacts}
        >
          <AtSymbolIcon className={styles.icon} />
          {t('menu.contacts')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.account.gallery && styles.active)}
          aria-label={paths.account.gallery}
          href={paths.account.gallery}
        >
          <PhotoIcon className={styles.icon} />
          {t('menu.gallery')}
        </Link>
        <Link
          className={cns(
            styles.item,
            pathname === paths.account.portfolio.index && styles.active,
            pathname === paths.account.portfolio.add && styles.active
          )}
          aria-label={paths.account.portfolio.index}
          href={paths.account.portfolio.index}
        >
          <BriefcaseIcon className={styles.icon} />
          {t('menu.portfolio')}
        </Link>
      </div>
    </div>
  )
}

export default Menu
