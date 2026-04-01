'use client'

import React, { FC, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { IPrices, IType } from '@/shared/interfaces'

import { DESIGN_TYPES, paths } from '@/constants'

import CardPricesItem from '@/modules/home/list/components/cardPrices/cardPricesItem'

import styles from './cardPrices.module.scss'

interface ICardPrices {
  readonly prices: IPrices
  readonly slug: string
  readonly types: string[]
}

// кол-во выводимых цен по умолчанию
const limit = 3

const CardPrices: FC<ICardPrices> = ({ prices, slug, types }) => {
  const t = useTranslations('profile')

  const searchParams = useSearchParams() as URLSearchParams
  const params = new URLSearchParams(searchParams)
  const urlTypes = params.get('types')?.split(',')
  const urlTypesSet = new Set(urlTypes)

  const [count, setCount] = useState(limit)

  const allowed = DESIGN_TYPES.filter((designType: IType) => types.includes(designType.value))

  // сортировка, сначала те что в поиске, потом все остальные
  const sortedAllowed = [...allowed].sort((a, b) => {
    const aInUrlTypes = urlTypesSet.has(a.value)
    const bInUrlTypes = urlTypesSet.has(b.value)

    if (aInUrlTypes === bInUrlTypes) return 0

    return aInUrlTypes ? -1 : 1
  })

  // итоговый спсиок с учетом сортировки и лимитом
  const list = sortedAllowed.slice(0, count)

  const handleShow = () => setCount(allowed.length)
  const handleHide = () => setCount(limit)

  return (
    <div className={styles.root}>
      <h3>
        <Link href={paths.profiles + slug} target="_blank">
          {t('prices.caption')}
        </Link>
      </h3>

      {list?.map(type => (
        <CardPricesItem
          key={type.value}
          label={type.label}
          prices={prices}
          unit={type.unit}
          value={type.value}
        />
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
