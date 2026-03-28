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
        {/*<Link*/}
        {/*  className={cns(styles.item, pathname === paths.profile.index && styles.active)}*/}
        {/*  aria-label={paths.profile.index}*/}
        {/*  href={paths.profile.index}*/}
        {/*>*/}
        {/*  <UserCircleIcon className={styles.icon} />*/}
        {/*  {t('menu.index')}*/}
        {/*</Link>*/}
        <Link
          className={cns(styles.item, pathname === paths.profile.about && styles.active)}
          aria-label={paths.profile.about}
          href={paths.profile.about}
        >
          <DocumentTextIcon className={styles.icon} />
          {t('menu.about')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.profile.prices && styles.active)}
          aria-label={paths.profile.prices}
          href={paths.profile.prices}
        >
          <BanknotesIcon className={styles.icon} />
          {t('menu.prices')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.profile.contacts && styles.active)}
          aria-label={paths.profile.contacts}
          href={paths.profile.contacts}
        >
          <AtSymbolIcon className={styles.icon} />
          {t('menu.contacts')}
        </Link>
        <Link
          className={cns(styles.item, pathname === paths.profile.gallery && styles.active)}
          aria-label={paths.profile.gallery}
          href={paths.profile.gallery}
        >
          <PhotoIcon className={styles.icon} />
          {t('menu.gallery')}
        </Link>
        {/*<Link*/}
        {/*  className={cns(styles.item, pathname === paths.profile.portfolio && styles.active)}*/}
        {/*  aria-label={paths.profile.portfolio}*/}
        {/*  href={paths.profile.portfolio}*/}
        {/*>*/}
        {/*  <BriefcaseIcon className={styles.icon} />*/}
        {/*  {t('menu.portfolio')}*/}
        {/*</Link>*/}
      </div>
    </div>
  )
}

export default Menu
