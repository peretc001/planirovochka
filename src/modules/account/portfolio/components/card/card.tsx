import React, { FC } from 'react'
import { message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TrashIcon } from '@heroicons/react/24/outline'

import { IPortfolio } from '@/shared/interfaces'

import { CURRENCY } from '@/constants'

import numberFormatter from '@/lib/numberFormatter'

import { deletePortfolioApi } from '@/modules/account/portfolio/api/deletePortfolioApi'

import styles from './card.module.scss'

interface ICard {
  readonly card: IPortfolio
}

const Card: FC<ICard> = ({ card }) => {
  const t = useTranslations('account')

  const queryClient = useQueryClient()

  const { mutate: deletePortfolio } = useMutation({
    mutationFn: (id: number) => deletePortfolioApi(id),
    onError: () => message.error(t('error')),
    onSuccess: status => {
      if (status) {
        queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      }
    }
  })

  const handleRemove = () => {
    deletePortfolio(card.id)
  }

  return (
    <div className={styles.root}>
      <div className={styles.delete} onClick={handleRemove}>
        <TrashIcon className={styles.icon} />
      </div>

      <picture className={styles.preview}>
        <img src={process.env.NEXT_PUBLIC_S3_PATH + card.photos[0]} />
        <div className={styles.count}>{card.photos.length}</div>
      </picture>

      <div className={styles.content}>
        <div className={styles.title}>{card.title}</div>

        {card.description ? (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: card.description }}
          />
        ) : null}

        <div className={styles.footer}>
          <div className={styles.price}>
            {numberFormatter(card.price)} {CURRENCY}
          </div>

          {card.file ? (
            <a
              className={styles.file}
              href={process.env.NEXT_PUBLIC_S3_PATH + card.file}
              rel="noreferrer"
              target="_blank"
            >
              <img className={styles.icon} src="/icons/types/pdf.svg" />
              <div className={styles.name}>{t('portfolio.add.file.label')}</div>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Card
