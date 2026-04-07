import React, { FC } from 'react'
import cns from 'classnames'

import { BuildingOffice2Icon, PaintBrushIcon, UserIcon } from '@heroicons/react/24/outline'

import styles from './cardInfo.module.scss'

interface ICardInfoStatus {
  readonly label: string
  readonly status: string
}

const CardInfoStatus: FC<ICardInfoStatus> = ({ label, status }) => {
  const statusIcon =
    status === 'individual' ? (
      <UserIcon className={styles.icon} />
    ) : status === 'studio' ? (
      <PaintBrushIcon className={styles.icon} />
    ) : (
      <BuildingOffice2Icon className={styles.icon} />
    )

  return (
    <div className={cns(styles.status, styles[status])}>
      <div className={styles.icon_wrapper}>{statusIcon}</div>
      {label}
    </div>
  )
}

export default CardInfoStatus
