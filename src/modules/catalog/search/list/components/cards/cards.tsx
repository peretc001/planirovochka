import React, { FC } from 'react'

import { IProfile } from '@/shared/interfaces'

import Card from '@/modules/catalog/search/list/components/card/card'

import styles from './cards.module.scss'

interface ICards {
  readonly cards: IProfile[]
}

const Cards: FC<ICards> = ({ cards }) => (
  <div className={styles.root}>
    {cards.map(card => (
      <Card key={card.id} card={card} />
    ))}
  </div>
)

export default Cards
