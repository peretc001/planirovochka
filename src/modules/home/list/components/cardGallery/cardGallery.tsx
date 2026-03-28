'use client'

import React, { FC } from 'react'
import Link from 'next/link'

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
  const [fancyboxRef] = useFancybox()

  const { isMobileSM } = useMatchMedia()

  const limit = isMobileSM ? 2 : 4

  const photos = gallery.length - 3
  const count = photos > 99 ? 99 : photos

  return (
    <div ref={fancyboxRef} className={styles.root}>
      {gallery.slice(0, limit).map(photo => (
        <a
          key={photo.id}
          data-caption={photo.description}
          data-fancybox="gallery"
          href={process.env.NEXT_PUBLIC_S3_PATH + photo.url}
        >
          <picture className={styles.picture}>
            <img alt={photo.description} src={process.env.NEXT_PUBLIC_S3_PATH + photo.url} />
          </picture>
        </a>
      ))}

      {gallery.length > 3 && (
        <Link className={styles.more} href={paths.profiles + slug}>
          +{count}
        </Link>
      )}
    </div>
  )
}

export default CardGallery
