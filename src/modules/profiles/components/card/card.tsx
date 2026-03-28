import React, { FC } from 'react'
import Link from 'next/link'

import { IProfile } from '@/shared/interfaces'

import { paths } from '@/constants'

import CardDescription from '@/modules/profiles/components/cardDescription/cardDescription'
import CardGallery from '@/modules/profiles/components/cardGallery/cardGallery'
import CardInfo from '@/modules/profiles/components/cardInfo/cardInfo'
import CardPrices from '@/modules/profiles/components/cardPrices/cardPrices'
import CardStyles from '@/modules/profiles/components/cardStyles/cardStyles'

import styles from './card.module.scss'

interface ICard {
  readonly card: IProfile
}
const Card: FC<ICard> = ({ card }) => (
  <div className={styles.root}>
    <div className={styles.breadcrumbs}>
      <Link href={paths.home}>Профили</Link> / {card.name}
    </div>

    <div className={styles.container}>
      <CardInfo card={card} />

      {card.stylesLabel.length > 0 ? <CardStyles stylesLabel={card.stylesLabel} /> : null}

      {card.description ? <CardDescription description={card.description} /> : null}

      {card.gallery?.length > 0 && <CardGallery gallery={card.gallery} />}

      <CardPrices prices={card.prices} types={card.types} />
    </div>
  </div>
)

export default Card
