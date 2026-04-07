import React, { FC } from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { IProfile } from '@/shared/interfaces'

import { paths } from '@/constants'

import CardContacts from '@/modules/catalog/slug/components/cardContacts/cardContacts'
import CardDescription from '@/modules/catalog/slug/components/cardDescription/cardDescription'
import CardGallery from '@/modules/catalog/slug/components/cardGallery/cardGallery'
import CardInfo from '@/modules/catalog/slug/components/cardInfo/cardInfo'
import CardPortfolio from '@/modules/catalog/slug/components/cardPortfolio/cardPortfolio'
import CardPrices from '@/modules/catalog/slug/components/cardPrices/cardPrices'
import CardStyles from '@/modules/catalog/slug/components/cardStyles/cardStyles'

import styles from './card.module.scss'

interface ICard {
  readonly card: IProfile
}

const Card: FC<ICard> = async ({ card }) => {
  const t = await getTranslations('catalog')

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className="breadcrumbs">
          <Link href={paths.catalog}>{t('title')}</Link> / {card.name}
        </div>

        <div className={styles.container}>
          <CardInfo card={card} />

          {card.stylesLabel.length > 0 ? <CardStyles stylesLabel={card.stylesLabel} /> : null}

          {card.description ? <CardDescription description={card.description} /> : null}

          {card.gallery?.length > 0 && <CardGallery gallery={card.gallery} />}

          {card.portfolio?.length > 0 && <CardPortfolio portfolio={card.portfolio} />}

          <div className={styles.column}>
            <CardPrices prices={card.prices} types={card.types} />
            {card.contacts ? <CardContacts contacts={card.contacts} /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
