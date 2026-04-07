import React, { FC } from 'react'

import { IPortfolio } from '@/shared/interfaces'

import { CURRENCY } from '@/constants'

import numberFormatter from '@/lib/numberFormatter'

import styles from './cardPortfolioItem.module.scss'

interface ICardPortfolioItem {
  readonly card: IPortfolio
}

const CardPortfolioItem: FC<ICardPortfolioItem> = ({ card }) => (
  <div className={styles.root}>
    <picture className={styles.preview}>
      <img src={process.env.NEXT_PUBLIC_S3_PATH + card.photos[0]} />
      <div className={styles.count}>{card.photos.length}</div>
    </picture>

    <div className={styles.content}>
      <div className={styles.title}>{card.title}</div>

      <div className={styles.footer}>
        <div className={styles.price}>
          {numberFormatter(card.price)} {CURRENCY}
        </div>

        {card.file ? (
          <div className={styles.file}>
            <img className={styles.icon} src="/icons/types/pdf.svg" />
          </div>
        ) : null}
      </div>
    </div>
  </div>
)

export default CardPortfolioItem
