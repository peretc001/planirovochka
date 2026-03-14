import React, { FC } from 'react'
import { message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TrashIcon } from '@heroicons/react/24/outline'

import { IGallery } from '@/shared/interfaces'

import { deleteGalleryApi } from '@/modules/profile/gallery/api/deleteGalleryApi'

import styles from './card.module.scss'

interface ICard {
  readonly card: IGallery
}

const Card: FC<ICard> = ({ card }) => {
  const t = useTranslations('profile')

  const queryClient = useQueryClient()

  const { mutate: deleteFile } = useMutation({
    mutationFn: (id: number) => deleteGalleryApi(id),
    onError: () => message.error(t('error')),
    onSuccess: status => {
      if (status) {
        queryClient.invalidateQueries({ queryKey: ['gallery'] })
      }
    }
  })

  const handleRemove = () => {
    deleteFile(card.id)
  }

  return (
    <div key={card.id} className={styles.root}>
      <div className={styles.preview}>
        <div className={styles.delete} onClick={handleRemove}>
          <TrashIcon className={styles.icon} />
        </div>

        <div className={styles.type}>{card.type === 'visual' ? 'визуал' : 'объект'}</div>

        {card.description ? (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: card.description }}
          />
        ) : null}

        <picture className={styles.picture}>
          <img alt={card.description} src={process.env.NEXT_PUBLIC_URL + card.url} />
        </picture>
      </div>
    </div>
  )
}

export default Card
