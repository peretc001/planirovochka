import React, { FC } from 'react'

import { IGallery } from '@/shared/interfaces'

import styles from './cardGallery.module.scss'

interface IGalleryList {
  readonly gallery: IGallery[]
}

const CardGallery: FC<IGalleryList> = ({ gallery }) => (
  <div className={styles.root}>
    {gallery.map(photo => (
      <picture key={photo.id} className={styles.picture}>
        <img alt={photo.description} src={process.env.NEXT_PUBLIC_URL + photo.url} />
      </picture>
    ))}
  </div>
)

export default CardGallery
