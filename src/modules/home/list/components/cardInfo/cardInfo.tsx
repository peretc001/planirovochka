import React, { FC } from 'react'
import Link from 'next/link'

import { MapPinIcon } from '@heroicons/react/24/outline'

import { IProfile } from '@/shared/interfaces'

import { paths } from '@/constants'

import CardInfoExperience from '@/modules/home/list/components/cardInfo/cardInfoExperience'
import CardInfoStatus from '@/modules/home/list/components/cardInfo/cardInfoStatus'

import styles from './cardInfo.module.scss'

interface ICardInfo {
  readonly card: IProfile
}

const CardInfo: FC<ICardInfo> = ({ card }) => (
  <div className={styles.root}>
    <Link className={styles.avatar} href={paths.profiles + card.owner_id} target="_blank">
      <img src={process.env.NEXT_PUBLIC_S3_PATH + card.avatar} />
    </Link>

    <div className={styles.info}>
      <Link href={paths.profiles + card.owner_id} target="_blank">
        <div className={styles.name}>{card.name}</div>
      </Link>

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
