import React, { FC, useEffect, useRef, useState } from 'react'
import cns from 'classnames'
import { useTranslations } from 'next-intl'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import { IPortfolio } from '@/shared/interfaces'

import { CURRENCY } from '@/constants'

import numberFormatter from '@/lib/numberFormatter'
import useFancybox from '@/lib/useFancybox'
import { useMatchMedia } from '@/lib/useMatchMedia'

import styles from './cardPortfolioModal.module.scss'

interface ICardPortfolioModal {
  readonly card: IPortfolio
}

const CardPortfolioModal: FC<ICardPortfolioModal> = ({ card }) => {
  const t = useTranslations('profile')

  const [fancyboxRef] = useFancybox()

  const galleryRef = useRef<HTMLDivElement>(null)

  const { isMobile } = useMatchMedia()

  const [disabledLeft, setDisabledLeft] = useState(true)
  const [disabledRight, setDisabledRight] = useState(card.photos?.length < 4)

  const scrollPrev = () => {
    if (galleryRef.current) {
      const card = galleryRef.current?.querySelector('[data-fancybox="photos"]')
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
      const card = galleryRef.current?.querySelector('[data-fancybox="photos"]')
      if (card) {
        galleryRef.current.scrollTo({
          behavior: 'smooth',
          left: galleryRef.current.scrollLeft + card.clientWidth
        })
      }
    }
  }

  const handleScroll = (e: React.SyntheticEvent<HTMLDivElement>) => {
    if (isMobile || card.photos?.length < 4) return

    setDisabledLeft(e.currentTarget.scrollLeft < 100)
    setDisabledRight(
      e.currentTarget.clientWidth + e.currentTarget.scrollLeft > e.currentTarget.scrollWidth - 100
    )
  }

  useEffect(() => {
    setDisabledRight(card.photos?.length < 4)
  }, [card.photos.length])

  return (
    <div className={styles.root}>
      <picture className={styles.preview}>
        <img src={process.env.NEXT_PUBLIC_S3_PATH + card.photos[0]} />
      </picture>

      <div className={styles.content}>
        <div className={styles.title}>{card.title}</div>

        {card.description ? (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: card.description }}
          />
        ) : null}

        <div ref={fancyboxRef} className={styles.wrapper}>
          <h3>{t('portfolio.preview.photo')}</h3>
          <div ref={galleryRef} className={styles.photos} onScroll={handleScroll}>
            {card.photos.map(photo => (
              <a key={photo} data-fancybox="photos" href={process.env.NEXT_PUBLIC_S3_PATH + photo}>
                <picture className={styles.picture}>
                  <img src={process.env.NEXT_PUBLIC_S3_PATH + photo} />
                </picture>
              </a>
            ))}
          </div>

          {!isMobile && card.photos?.length > 4 && (
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

        <div className={styles.price}>
          {t('portfolio.preview.price')}:&nbsp;
          <span>
            {numberFormatter(card.price)} {CURRENCY}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CardPortfolioModal
