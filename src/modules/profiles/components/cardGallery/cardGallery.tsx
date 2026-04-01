'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import cns from 'classnames'
import { useTranslations } from 'next-intl'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import { IGallery } from '@/shared/interfaces'

import useFancybox from '@/lib/useFancybox'
import { useMatchMedia } from '@/lib/useMatchMedia'

import styles from './cardGallery.module.scss'

interface IGalleryList {
  readonly gallery: IGallery[]
}

const CardGallery: FC<IGalleryList> = ({ gallery }) => {
  const t = useTranslations('profile')

  const [fancyboxRef] = useFancybox()
  const galleryRef = useRef<HTMLDivElement>(null)

  const { isMobile } = useMatchMedia()

  const [disabledLeft, setDisabledLeft] = useState(true)
  const [disabledRight, setDisabledRight] = useState(gallery?.length < 4)

  const scrollPrev = () => {
    if (galleryRef.current) {
      const card = galleryRef.current?.querySelector('[data-fancybox="gallery"]')
      if (card) {
        galleryRef.current.scrollTo({
          behavior: 'smooth',
          left: galleryRef.current.scrollLeft - card.clientWidth
        })
      }
    }
  }

  const scrollNext = () => {
    if (galleryRef.current) {
      const card = galleryRef.current?.querySelector('[data-fancybox="gallery"]')
      if (card) {
        galleryRef.current.scrollTo({
          behavior: 'smooth',
          left: galleryRef.current.scrollLeft + card.clientWidth
        })
      }
    }
  }

  const handleScroll = (e: React.SyntheticEvent<HTMLDivElement>) => {
    if (isMobile || gallery?.length < 4) return

    setDisabledLeft(e.currentTarget.scrollLeft < 100)
    setDisabledRight(
      e.currentTarget.clientWidth + e.currentTarget.scrollLeft > e.currentTarget.scrollWidth - 100
    )
  }

  useEffect(() => {
    setDisabledRight(gallery?.length < 4)
  }, [gallery.length])

  return (
    <div ref={fancyboxRef} className={styles.root}>
      <h3>
        {t('gallery.caption')} ({gallery.length})
      </h3>

      <div ref={galleryRef} className={styles.gallery} onScroll={handleScroll}>
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

      {!isMobile && gallery?.length > 4 && (
        <div className={styles.buttons}>
          <button
            className={cns(styles.prev, disabledLeft && styles.disabled)}
            onClick={scrollPrev}
          >
            <ChevronLeftIcon className={styles.icon} />
          </button>

          <button
            className={cns(styles.prev, disabledRight && styles.disabled)}
            onClick={scrollNext}
          >
            <ChevronRightIcon className={styles.icon} />
          </button>
        </div>
      )}
    </div>
  )
}

export default CardGallery
