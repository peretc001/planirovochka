import React from 'react'

import styles from './cardGallery.module.scss'

const CardGallery = ({ gallery }) => (
  <div className={styles.root}>
    {gallery.map(photo => (
      <picture key={photo.id} className={styles.picture}>
        <img alt={photo.description} src={process.env.NEXT_PUBLIC_URL + photo.url} />
      </picture>
    ))}
  </div>
)

export default CardGallery
