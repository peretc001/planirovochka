import React, { FC } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { IPortfolio } from '@/shared/interfaces'

import { paths } from '@/constants'

import CardPortfolioItem from '@/modules/home/list/components/cardPortfolioItem/cardPortfolioItem'

import styles from './cardPortfolio.module.scss'

const LIMIT = 4

interface ICardPortfolio {
  readonly portfolio: IPortfolio[]
  readonly slug: string
}

const CardPortfolio: FC<ICardPortfolio> = ({ portfolio, slug }) => {
  const t = useTranslations('profile')

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3>
          <Link href={paths.profiles + slug + '#portfolio'} target="_blank">
            {t('portfolio.title')} ({portfolio.length})
          </Link>
        </h3>

        <Link className={styles.link} href={paths.profiles + slug + '#portfolio'} target="_blank">
          {t('view_all')}
        </Link>
      </div>

      <div className={styles.list}>
        {portfolio.slice(0, LIMIT).map(card => (
          <Link
            key={card.id}
            className={styles.card}
            href={paths.profiles + slug + '#portfolio'}
            target="_blank"
          >
            <CardPortfolioItem card={card} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CardPortfolio
