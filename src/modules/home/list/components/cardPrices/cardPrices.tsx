import React, { FC } from 'react'
import { useTranslations } from 'next-intl'

import { IPrices, ITypes } from '@/shared/interfaces'

import { DESIGN_TYPES } from '@/constants'

import CardPricesItem from '@/modules/home/list/components/cardPrices/cardPricesItem'

import styles from './cardPrices.module.scss'

interface ICardPrices {
  readonly prices: IPrices
  readonly types: ITypes[]
}

const CardPrices: FC<ICardPrices> = ({ prices, types }) => {
  const t = useTranslations('profile')

  // @ts-expect-error: it works
  const allowed = DESIGN_TYPES.filter((t: ITypes) => types.includes(t.value))

  return (
    <div className={styles.root}>
      <h3>{t('prices.caption')}</h3>

      {allowed?.map(type => (
        <CardPricesItem key={type.value} label={type.label} prices={prices} value={type.value} />
      ))}
    </div>
  )
}

export default CardPrices
