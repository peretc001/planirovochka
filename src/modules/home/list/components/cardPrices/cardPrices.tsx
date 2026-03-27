import React, { FC, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { IPrices, IType } from '@/shared/interfaces'

import { DESIGN_TYPES } from '@/constants'

import CardPricesItem from '@/modules/home/list/components/cardPrices/cardPricesItem'

import styles from './cardPrices.module.scss'

interface ICardPrices {
  readonly prices: IPrices
  readonly types: string[]
}

// кол-во выводимых цен по умолчанию
const limit = 3

const CardPrices: FC<ICardPrices> = ({ prices, types }) => {
  const t = useTranslations('profile')

  const searchParams = useSearchParams() as URLSearchParams
  const params = new URLSearchParams(searchParams)
  const urlTypes = params.get('types')?.split(',')
  const urlTypesSet = new Set(urlTypes)

  const [count, setCount] = useState(limit)

  // сортировка, сначала те что в поиске, потом все остальные
  const allowed = DESIGN_TYPES.filter((designType: IType) => types.includes(designType.value))
  const sortedAllowed = [...allowed].sort((a, b) => {
    const aInUrlTypes = urlTypesSet.has(a.value)
    const bInUrlTypes = urlTypesSet.has(b.value)

    if (aInUrlTypes === bInUrlTypes) return 0

    return aInUrlTypes ? -1 : 1
  })

  const list = sortedAllowed.slice(0, count)

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
