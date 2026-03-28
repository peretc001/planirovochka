import React, { FC } from 'react'

import { IType } from '@/shared/interfaces'

import styles from './cardStyles.module.scss'

interface ICardTypes {
  readonly stylesLabel: IType[]
}

const CardStyles: FC<ICardTypes> = ({ stylesLabel }) => (
  <div className={styles.root}>
    {stylesLabel.map(item => (
      <div key={item.value} className={styles.item}>
        #{item.label}
      </div>
    ))}
  </div>
)

export default CardStyles
