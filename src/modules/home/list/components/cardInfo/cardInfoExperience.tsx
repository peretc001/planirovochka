import React, { FC } from 'react'
import { Tooltip } from 'antd'
import cns from 'classnames'
import { useTranslations } from 'next-intl'

import styles from './cardInfo.module.scss'

interface ICardInfoExperience {
  readonly experience: string
  readonly label: string
}

const CardInfoExperience: FC<ICardInfoExperience> = ({ experience, label }) => {
  const t = useTranslations('profile')

  const count =
    experience === '1'
      ? 1
      : experience === '3'
        ? 2
        : experience === '5'
          ? 3
          : experience === '10'
            ? 4
            : 5

  return (
    <div className={styles.experience}>
      {t('about.experience.label')}:
      <Tooltip title={label}>
        <div className={styles.points}>
          {[0, 1, 2, 3, 4].map(item => (
            <div key={item} className={cns(styles.point, count > item && styles.active)} />
          ))}
        </div>
      </Tooltip>
    </div>
  )
}

export default CardInfoExperience
