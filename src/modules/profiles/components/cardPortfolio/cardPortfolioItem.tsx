import React, { FC } from 'react'

import { IPortfolio } from '@/shared/interfaces'

import { CURRENCY } from '@/constants'

import numberFormatter from '@/lib/numberFormatter'

import styles from './cardPortfolio.module.scss'

interface ICardPortfolioItem {
  readonly card: IPortfolio
}

const CardPortfolioItem: FC<ICardPortfolioItem> = ({ card }) => (
  <div className={styles.portfolio} data-card="portfolio">
    <picture className={styles.preview}>
      <img src={process.env.NEXT_PUBLIC_S3_PATH + card.photos[0]} />
      <div className={styles.count}>{card.photos.length}</div>
    </picture>

    <div className={styles.content}>
      <div className={styles.title}>{card.title}</div>

      {card.description ? (
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: card.description }}
        />
      ) : null}

      <div className={styles.price}>
        {numberFormatter(card.price)} {CURRENCY}
      </div>
    </div>
  </div>
)

export default CardPortfolioItem
