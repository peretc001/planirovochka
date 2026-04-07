import React, { FC, useCallback, useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslations } from 'next-intl'

import { PlusIcon } from '@heroicons/react/24/outline'

import { IGallery } from '@/shared/interfaces'

import useFancybox from '@/lib/useFancybox'

import Add from '@/modules/account/gallery/components/add/add'
import AddMulti from '@/modules/account/gallery/components/addMulti/addMulti'
import Card from '@/modules/account/gallery/components/card/card'

import styles from './list.module.scss'

interface IGalleryList {
  readonly list: IGallery[]
}

const List: FC<IGalleryList> = ({ list }) => {
  const t = useTranslations('account')

  const [fancyboxRef] = useFancybox()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalMultiOpen, setIsModalMultiOpen] = useState(false)

  const handleOpenAddModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseAddModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleOpenAddMultiModal = () => {
    setIsModalMultiOpen(true)
  }

  const handleCloseAddMultiModal = useCallback(() => {
    setIsModalMultiOpen(false)
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.add}>
        <Button type="primary" onClick={handleOpenAddModal}>
          <PlusIcon className={styles.icon} />
          {t('gallery.title')}
        </Button>

        <Button color="primary" variant="outlined" onClick={handleOpenAddMultiModal}>
          {t('gallery.multi')}
        </Button>
      </div>

      <div ref={fancyboxRef} className={styles.list}>
        {list?.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>

      {isModalOpen ? (
        <Modal
          className={styles.modal}
          footer={null}
          open={isModalOpen}
          onCancel={handleCloseAddModal}
        >
          <Add onCancel={handleCloseAddModal} />
        </Modal>
      ) : null}

      {isModalMultiOpen ? (
        <Modal
          className={styles.modal}
          footer={null}
          open={isModalMultiOpen}
          onCancel={handleCloseAddMultiModal}
        >
          <AddMulti onCancel={handleCloseAddMultiModal} />
        </Modal>
      ) : null}
    </div>
  )
}

export default List
