'use client'

import React, { FC } from 'react'
import { useSearchParams } from 'next/navigation'

import { IType } from '@/shared/interfaces'

import styles from './cardStyles.module.scss'

interface ICardTypes {
  readonly stylesLabel: IType[]
}

const CardStyles: FC<ICardTypes> = ({ stylesLabel }) => {
  const searchParams = useSearchParams() as URLSearchParams
  const params = new URLSearchParams(searchParams)
  const urlStyles = params.get('styles')?.split(',')
  const urlStylesSet = new Set(urlStyles)

  // сортировка, сначала те что в поиске, потом все остальные
  const sortedStyles = [...stylesLabel].sort((a, b) => {
    const aInUrlTypes = urlStylesSet.has(a.value)
    const bInUrlTypes = urlStylesSet.has(b.value)

    if (aInUrlTypes === bInUrlTypes) return 0

    return aInUrlTypes ? -1 : 1
  })

  return (
    <div className={styles.root}>
      {sortedStyles.map(item => (
        <div key={item.value} className={styles.item}>
          #{item.label}
        </div>
      ))}
    </div>
  )
}

export default CardStyles
