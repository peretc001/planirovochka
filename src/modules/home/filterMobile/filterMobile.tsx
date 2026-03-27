import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslations } from 'next-intl'

import { FunnelIcon } from '@heroicons/react/24/outline'

import Filter from '@/modules/home/filter'

import styles from './filterMobile.module.scss'

const FilterMobile = () => {
  const t = useTranslations('filter')

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const hideModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <>
      <div className={styles.root} onClick={openModal}>
        <FunnelIcon className={styles.icon} />
        {t('title')}
      </div>

      <Modal
        className={styles.modal}
        footer={
          <Button type="primary" onClick={hideModal}>
            {t('button')}
          </Button>
        }
        open={isModalOpen}
        title={t('title')}
        width="100%"
        onCancel={hideModal}
      >
        <Filter isMobile />
      </Modal>
    </>
  )
}

export default FilterMobile
