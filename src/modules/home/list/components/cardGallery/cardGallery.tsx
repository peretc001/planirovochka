import React, { FC } from 'react'

import { IGallery } from '@/shared/interfaces'

import useFancybox from '@/lib/useFancybox'

import styles from './cardGallery.module.scss'

interface IGalleryList {
  readonly gallery: IGallery[]
}

const CardGallery: FC<IGalleryList> = ({ gallery }) => {
  const [fancyboxRef] = useFancybox()

  return (
    <div ref={fancyboxRef} className={styles.root}>
      {gallery.map(photo => (
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
    </div>
  )
}

export default CardGallery
