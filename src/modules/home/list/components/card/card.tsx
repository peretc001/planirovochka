import React, { FC } from 'react'

import { IProfile } from '@/shared/interfaces'

import CardDescription from '@/modules/home/list/components/cardDescription/cardDescription'
import CardGallery from '@/modules/home/list/components/cardGallery/cardGallery'
import CardPrices from '@/modules/home/list/components/cardPrices/cardPrices'

import styles from './card.module.scss'

interface ICard {
  readonly card: IProfile
}
const Card: FC<ICard> = ({ card }) => (
  <div className={styles.root}>
    <div className={styles.header}>
      <img className={styles.avatar} src={process.env.NEXT_PUBLIC_URL + card.avatar} />

      <div className={styles.info}>
        <div className={styles.name}>{card.name}</div>

        <div className={styles.about}>
          <div className={styles.city}>{card.city}</div>
          <div className={styles.experience}>Опыт: {card.experience}</div>
          <div className={styles.status}>{card.status}</div>
        </div>
      </div>
    </div>

    <CardDescription description={card.description} />

    <CardGallery gallery={card.gallery} />

    <CardPrices prices={card.prices} types={card.types} />
  </div>
)

export default Card
