'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { IGallery } from '@/shared/interfaces'

import { paths } from '@/constants'

import useFancybox from '@/lib/useFancybox'
import { useMatchMedia } from '@/lib/useMatchMedia'

import styles from './cardGallery.module.scss'

interface IGalleryList {
  readonly gallery: IGallery[]
  readonly slug: string
}

const CardGallery: FC<IGalleryList> = ({ gallery, slug }) => {
  const t = useTranslations('profile')

  const [fancyboxRef] = useFancybox()

  const { isMobileSM } = useMatchMedia()

  const limit = isMobileSM ? 3 : 5

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3>
          <Link href={paths.profiles + slug + '#gallery'} target="_blank">
            {t('gallery.caption')} ({gallery.length})
          </Link>
        </h3>

        <Link className={styles.link} href={paths.profiles + slug + '#gallery'} target="_blank">
          {t('view_all')}
        </Link>
      </div>

      <div ref={fancyboxRef} className={styles.list}>
        {gallery.slice(0, limit).map(photo => (
          <a
            key={photo.id}
            className={styles.card}
            data-caption={photo.description}
            data-fancybox="gallery"
            href={process.env.NEXT_PUBLIC_S3_PATH + photo.url}
          >
            <picture className={styles.picture}>
              <img alt={photo.description} src={process.env.NEXT_PUBLIC_S3_PATH + photo.url} />
            </picture>
          </a>
        ))}
      </div>
    </div>
  )
}

export default CardGallery
