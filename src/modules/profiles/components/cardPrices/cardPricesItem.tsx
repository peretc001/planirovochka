import React, { FC } from 'react'
import { useTranslations } from 'next-intl'

import { IPrices } from '@/shared/interfaces'

import numberFormatter from '@/lib/numberFormatter'

import styles from './cardPrices.module.scss'

interface ICardPricesItem {
  readonly label: string
  readonly prices: IPrices
  readonly unit: string
  readonly value: string
}

const CardPricesItem: FC<ICardPricesItem> = ({ label, prices, unit, value }) => {
  const t = useTranslations('profile')

  const getHtmlChunks = (chunks: any) => <sup>{chunks}</sup>

  // @ts-expect-error: it-works
  const min = prices?.[value + '_min']
  // @ts-expect-error: it-works
  const max = prices?.[value + '_max']

  const empty = !min && !max

  return (
    <div key={label} className={styles.item}>
      <div className={styles.title}>{label}</div>

      <div className={styles.dash} />

      {empty ? (
        <div className={styles.empty}>{t('prices.above')}</div>
      ) : (
        <div className={styles.price}>
          {min > 0 ? <div className={styles.min}>{numberFormatter(min)}</div> : null}
          {!min && max ? t('prices.to') : null}
          {min && max ? '–' : null}
          {max ? <div className={styles.min}>{numberFormatter(max)}</div> : null}
          <div className={styles.currency}>
            {t('prices.currency')}/{t.rich('prices.' + unit, { sup: getHtmlChunks })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CardPricesItem
