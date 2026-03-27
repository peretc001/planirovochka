import React, { FC } from 'react'

import { IProfile } from '@/shared/interfaces'

import CardDescription from '@/modules/home/list/components/cardDescription/cardDescription'
import CardGallery from '@/modules/home/list/components/cardGallery/cardGallery'
import CardInfo from '@/modules/home/list/components/cardInfo/cardInfo'
import CardPrices from '@/modules/home/list/components/cardPrices/cardPrices'

import styles from './card.module.scss'

interface ICard {
  readonly card: IProfile
}
const Card: FC<ICard> = ({ card }) => (
  <div className={styles.root}>
    <CardInfo card={card} />

    {card.description ? <CardDescription description={card.description} /> : null}

    {card.gallery.length > 0 && <CardGallery gallery={card.gallery} />}

    <CardPrices prices={card.prices} types={card.types} />
  </div>
)

export default Card
