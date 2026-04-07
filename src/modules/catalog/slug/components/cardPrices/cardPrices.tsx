import React, { FC } from 'react'
import { useTranslations } from 'next-intl'

import { IPrices, IType } from '@/shared/interfaces'

import { DESIGN_TYPES } from '@/constants'

import styles from './cardPrices.module.scss'

import CardPricesItem from './cardPricesItem'

interface ICardPrices {
  readonly prices: IPrices
  readonly types: string[]
}

const CardPrices: FC<ICardPrices> = ({ prices, types }) => {
  const t = useTranslations('account')

  const allowed = DESIGN_TYPES.filter((designType: IType) => types.includes(designType.value))

  return (
    <div id="prices" className={styles.root}>
      <h3>{t('prices.caption')}</h3>

      {allowed?.map(type => (
        <CardPricesItem
          key={type.value}
          label={type.label}
          prices={prices}
          unit={type.unit}
          value={type.value}
        />
      ))}
    </div>
  )
}

export default CardPrices
