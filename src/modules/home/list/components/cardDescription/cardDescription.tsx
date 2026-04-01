import React, { FC } from 'react'
import Link from 'next/link'

import { paths } from '@/constants'

import styles from './cardDescription.module.scss'

interface ICardDescription {
  readonly description: string
  readonly slug: string
}

const CardDescription: FC<ICardDescription> = ({ description, slug }) => (
  <Link
    className={styles.root}
    dangerouslySetInnerHTML={{ __html: description }}
    href={paths.profiles + slug}
    target="_blank"
  />
)

export default CardDescription
