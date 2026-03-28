import React, { FC } from 'react'
import { useTranslations } from 'next-intl'

import { IContacts } from '@/shared/interfaces'

import styles from './cardContacts.module.scss'

interface ICardContacts {
  readonly contacts: IContacts
}

const CardContacts: FC<ICardContacts> = ({ contacts }) => {
  const t = useTranslations('profile')

  return (
    <div className={styles.root}>
      {contacts.telegram || contacts.max ? <h3>{t('contacts.messengers')}</h3> : null}

      {contacts.telegram || contacts.max ? (
        <div className={styles.contacts}>
          {contacts.telegram ? (
            <a className={styles.contact} href={contacts.telegram} rel="noreferrer" target="_blank">
              <img src="/icons/socials/telegram.svg" />
              {t('contacts.write')} Telegram
            </a>
          ) : null}
          {contacts.max ? (
            <a className={styles.contact} href={contacts.max} rel="noreferrer" target="_blank">
              <img src="/icons/socials/max.svg" />
              {t('contacts.write')} Max
            </a>
          ) : null}
        </div>
      ) : null}

      {contacts.instagram || contacts.pinterest ? <h3>{t('contacts.socials')}</h3> : null}

      {contacts.instagram || contacts.pinterest ? (
        <div className={styles.contacts}>
          {contacts.instagram ? (
            <a
              className={styles.contact}
              href={contacts.instagram}
              rel="noreferrer"
              target="_blank"
            >
              <img src="/icons/socials/instagram.svg" />
              Instagram
            </a>
          ) : null}
          {contacts.pinterest ? (
            <a
              className={styles.contact}
              href={contacts.pinterest}
              rel="noreferrer"
              target="_blank"
            >
              <img src="/icons/socials/pinterest.svg" />
              Pinterest
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default CardContacts
