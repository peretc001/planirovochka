import React, { FC, useState } from 'react'
import { useTranslations } from 'next-intl'

import { IPrices, IType } from '@/shared/interfaces'

import { DESIGN_TYPES } from '@/constants'

import CardPricesItem from '@/modules/home/list/components/cardPrices/cardPricesItem'

import styles from './cardPrices.module.scss'

interface ICardPrices {
  readonly prices: IPrices
  readonly types: string[]
}

const limit = 3

const CardPrices: FC<ICardPrices> = ({ prices, types }) => {
  const t = useTranslations('profile')

  const [count, setCount] = useState(limit)

  const allowed = DESIGN_TYPES.filter((designType: IType) => types.includes(designType.value))
  const list = allowed.slice(0, count)

  const handleShow = () => setCount(allowed.length)
  const handleHide = () => setCount(limit)

  return (
    <div className={styles.root}>
      <h3>{t('prices.caption')}</h3>

      {list?.map(type => (
        <CardPricesItem key={type.value} label={type.label} prices={prices} value={type.value} />
      ))}

      {allowed.length >= limit ? (
        <div className={styles.more}>
          {count === limit ? (
            <button className={styles.show} onClick={handleShow}>
              {t('show')}
            </button>
          ) : (
            <button className={styles.show} onClick={handleHide}>
              {t('hide')}
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default CardPrices
