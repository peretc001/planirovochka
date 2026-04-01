import React, { FC } from 'react'

import { IProfile } from '@/shared/interfaces'

import CardDescription from '@/modules/home/list/components/cardDescription/cardDescription'
import CardGallery from '@/modules/home/list/components/cardGallery/cardGallery'
import CardInfo from '@/modules/home/list/components/cardInfo/cardInfo'
import CardPortfolio from '@/modules/home/list/components/cardPortfolio/cardPortfolio'
import CardPrices from '@/modules/home/list/components/cardPrices/cardPrices'
import CardStyles from '@/modules/home/list/components/cardStyles/cardStyles'

import styles from './card.module.scss'

interface ICard {
  readonly card: IProfile
}
const Card: FC<ICard> = ({ card }) => (
  <div className={styles.root}>
    <CardInfo card={card} />

    {card.stylesLabel?.length > 0 ? <CardStyles stylesLabel={card.stylesLabel} /> : null}

    {card.description ? (
      <CardDescription description={card.description} slug={card.owner_id} />
    ) : null}

    {card.gallery?.length > 0 && <CardGallery gallery={card.gallery} slug={card.owner_id} />}

    {card.portfolio?.length > 0 && (
      <CardPortfolio portfolio={card.portfolio} slug={card.owner_id} />
    )}

    <CardPrices prices={card.prices} slug={card.owner_id} types={card.types} />
  </div>
)

export default Card
