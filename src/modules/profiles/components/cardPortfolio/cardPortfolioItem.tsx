import React, { FC, useCallback, useState } from 'react'
import { Modal } from 'antd'
import { useTranslations } from 'next-intl'

import { IPortfolio } from '@/shared/interfaces'

import { CURRENCY } from '@/constants'

import numberFormatter from '@/lib/numberFormatter'

import CardPortfolioModal from '@/modules/profiles/components/cardPortfolioModal/cardPortfolioModal'

import styles from './cardPortfolio.module.scss'

interface ICardPortfolioItem {
  readonly card: IPortfolio
}

const CardPortfolioItem: FC<ICardPortfolioItem> = ({ card }) => {
  const t = useTranslations('profile')

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <>
      <div className={styles.portfolio} data-card="portfolio" onClick={handleOpenModal}>
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
              <div className={styles.file}>
                <img className={styles.icon} src="/icons/types/pdf.svg" />
                <div className={styles.name}>{t('portfolio.add.file.label')}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <Modal
          className={styles.modal}
          footer={null}
          open={isModalOpen}
          onCancel={handleCloseModal}
        >
          <CardPortfolioModal card={card} />
        </Modal>
      ) : null}
    </>
  )
}

export default CardPortfolioItem
