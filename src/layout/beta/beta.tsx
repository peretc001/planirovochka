'use client'

import React, { useCallback, useState } from 'react'
import { Modal } from 'antd'

import styles from './beta.module.scss'

const Beta = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hideShow = () => {
    setIsModalOpen(true)
  }

  const hideModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <>
      <div className={styles.root}>
        <div className={styles.wrapper} onClick={hideShow}>
          <div className={styles.beta}>beta</div>
          <div className={styles.text}>Сервис находится в стадии разработки. Подробнее</div>
        </div>
      </div>

      <Modal
        className={styles.modal}
        footer={null}
        open={isModalOpen}
        width="450px"
        onCancel={hideModal}
      >
        <div className={styles.description}>
          <p>🚀 Сервис в стадии активной разработки.</p>
          <p>Но Вы уже можете добавить свой профиль.</p>
          <p>Если у вас есть вопросы или идеи, пишите:</p>
          <div className={styles.contact}>
            👉
            <a href="https://t.me/planirovochka_io" rel="noreferrer" target="_blank">
              t.me/planirovochka_io
            </a>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Beta
