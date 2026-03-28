import React, { FC } from 'react'

import { MapPinIcon } from '@heroicons/react/24/outline'

import { IProfile } from '@/shared/interfaces'

import CardInfoExperience from '@/modules/profiles/components/cardInfo/cardInfoExperience'
import CardInfoStatus from '@/modules/profiles/components/cardInfo/cardInfoStatus'

import styles from './cardInfo.module.scss'

interface ICardInfo {
  readonly card: IProfile
}

const CardInfo: FC<ICardInfo> = ({ card }) => (
  <div className={styles.root}>
    <div className={styles.avatar}>
      <img src={process.env.NEXT_PUBLIC_S3_PATH + card.avatar} />
    </div>

    <div className={styles.info}>
      <div className={styles.name}>{card.name}</div>

      <div className={styles.about}>
        <div className={styles.city}>
          <MapPinIcon className={styles.icon} />
          {card.city}
        </div>

        <CardInfoExperience experience={card.experience} label={card.experienceLabel} />
        <CardInfoStatus label={card.statusLabel} status={card.status} />
      </div>
    </div>
  </div>
)

export default CardInfo
