import React, { FC, useCallback, useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslations } from 'next-intl'

import { PlusIcon } from '@heroicons/react/24/outline'

import { IGallery } from '@/shared/interfaces'

import useFancybox from '@/lib/useFancybox'

import Add from '@/modules/profile/gallery/components/add/add'
import Card from '@/modules/profile/gallery/components/card/card'

import styles from './list.module.scss'

interface IGalleryList {
  readonly list: IGallery[]
}

const List: FC<IGalleryList> = ({ list }) => {
  const t = useTranslations('profile')

  const [fancyboxRef] = useFancybox()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenAddModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseAddModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <div className={styles.root}>
      <div>
        <Button type="primary" onClick={handleOpenAddModal}>
          <PlusIcon className={styles.icon} />
          {t('gallery.title')}
        </Button>
      </div>

      <div ref={fancyboxRef} className={styles.list}>
        {list?.map(card => (
          <Card card={card} />
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
    </div>
  )
}

export default List
