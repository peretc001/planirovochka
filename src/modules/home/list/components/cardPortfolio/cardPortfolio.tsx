import React, { FC } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { IPortfolio } from '@/shared/interfaces'

import { paths } from '@/constants'

import CardPortfolioItem from '@/modules/home/list/components/cardPortfolio/cardPortfolioItem'

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
      <h3>
        <Link href={paths.profiles + slug} target="_blank">
          {t('portfolio.title')} ({portfolio.length})
        </Link>
      </h3>

      <div className={styles.list}>
        {portfolio.slice(0, LIMIT).map(card => (
          <Link key={card.id} href={paths.profiles + slug} target="_blank">
            <CardPortfolioItem card={card} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CardPortfolio
