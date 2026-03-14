import React, { FC } from 'react'

import styles from './cardDescription.module.scss'

interface ICardDescription {
  readonly description: string
}

const CardDescription: FC<ICardDescription> = ({ description }) => (
  <div className={styles.root} dangerouslySetInnerHTML={{ __html: description }} />
)

export default CardDescription
