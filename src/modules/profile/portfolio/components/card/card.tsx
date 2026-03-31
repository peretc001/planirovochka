import React, { FC } from 'react'
import { message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TrashIcon } from '@heroicons/react/24/outline'

import { IGallery, IPortfolio } from '@/shared/interfaces'

import { deleteGalleryApi } from '@/modules/profile/gallery/api/deleteGalleryApi'
import { deletePortfolioApi } from '@/modules/profile/portfolio/api/deletePortfolioApi'

import styles from './card.module.scss'

interface ICard {
  readonly card: IPortfolio
}

const Card: FC<ICard> = ({ card }) => {
  const t = useTranslations('profile')

  const queryClient = useQueryClient()

  const { mutate: deleteFile } = useMutation({
    mutationFn: (id: number) => deletePortfolioApi(id),
    onError: () => message.error(t('error')),
    onSuccess: status => {
      if (status) {
        queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      }
    }
  })

  const handleRemove = () => {
    deleteFile(card.id)
  }

  return (
    <div className={styles.root}>
      <div className={styles.delete} onClick={handleRemove}>
        <TrashIcon className={styles.icon} />
      </div>

      <div className={styles.type}>{card.title}</div>

      {card.description ? (
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: card.description }}
        />
      ) : null}

      <div className={styles.photos}>
        {card.photos.map((file, index) => (
          <picture key={index} className={styles.picture}>
            <img src={process.env.NEXT_PUBLIC_S3_PATH + file} />
          </picture>
        ))}
      </div>
    </div>
  )
}

export default Card
