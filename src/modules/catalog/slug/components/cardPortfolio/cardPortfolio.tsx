'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import cns from 'classnames'
import { useTranslations } from 'next-intl'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import { IPortfolio } from '@/shared/interfaces'

import { useMatchMedia } from '@/lib/useMatchMedia'

import styles from './cardPortfolio.module.scss'

import CardPortfolioItem from './cardPortfolioItem'

interface ICardPortfolio {
  readonly portfolio: IPortfolio[]
}

const CardPortfolio: FC<ICardPortfolio> = ({ portfolio }) => {
  const t = useTranslations('account')

  const portfolioRef = useRef<HTMLDivElement>(null)

  const { isMobile } = useMatchMedia()

  const [disabledLeft, setDisabledLeft] = useState(true)
  const [disabledRight, setDisabledRight] = useState(portfolio?.length < 4)

  const scrollPrev = () => {
    if (portfolioRef.current) {
      const card = portfolioRef.current?.querySelector('[data-card="portfolio"]')
      if (card) {
        portfolioRef.current.scrollTo({
          behavior: 'smooth',
          left: portfolioRef.current.scrollLeft - card.clientWidth
        })
      }
    }
  }

  const scrollNext = () => {
    if (portfolioRef.current) {
      const card = portfolioRef.current?.querySelector('[data-card="portfolio"]')
      if (card) {
        portfolioRef.current.scrollTo({
          behavior: 'smooth',
          left: portfolioRef.current.scrollLeft + card.clientWidth
        })
      }
    }
  }

  const handleScroll = (e: React.SyntheticEvent<HTMLDivElement>) => {
    if (isMobile || portfolio?.length < 4) return

    setDisabledLeft(e.currentTarget.scrollLeft < 100)
    setDisabledRight(
      e.currentTarget.clientWidth + e.currentTarget.scrollLeft > e.currentTarget.scrollWidth - 100
    )
  }

  useEffect(() => {
    setDisabledRight(portfolio?.length < 4)
  }, [portfolio.length])

  return (
    <div id="portfolio" className={styles.root}>
      <h3>
        {t('portfolio.title')} ({portfolio.length})
      </h3>

      <div ref={portfolioRef} className={styles.list} onScroll={handleScroll}>
        {portfolio.map(card => (
          <CardPortfolioItem key={card.id} card={card} />
        ))}
      </div>

      {!isMobile && portfolio?.length > 4 && (
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

export default CardPortfolio
