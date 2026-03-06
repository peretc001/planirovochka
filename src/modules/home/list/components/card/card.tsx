import React, { FC } from 'react'

import { IProfile } from '@/shared/interfaces'

import styles from './card.module.scss'

interface ICard {
  readonly card: IProfile
}
const Card: FC<ICard> = ({ card }) => (
  <div className={styles.root}>
    <div className={styles.header}>
      <img className={styles.avatar} src={'https://planirovochka.io/' + card.avatar} />

      <div className={styles.info}>
        <div className={styles.name}>{card.name}</div>

        <div className={styles.about}>
          <div className={styles.city}>{card.city}</div>
          <div className={styles.experience}>{card.experience}</div>
          <div className={styles.status}>{card.status}</div>
        </div>
      </div>
    </div>
  </div>
)

export default Card
