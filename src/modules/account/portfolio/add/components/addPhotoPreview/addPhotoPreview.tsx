import React, { FC } from 'react'

import { TrashIcon } from '@heroicons/react/24/outline'

import styles from './addPhotoPreview.module.scss'

interface IAddPhotoPreview {
  readonly index: number
  readonly preview: string
  readonly onRemove: (id: number) => void
}

const AddPhotoPreview: FC<IAddPhotoPreview> = ({ index, preview, onRemove }) => {
  const handleRemove = () => {
    onRemove(index)
  }

  return (
    <div className={styles.root}>
      <div className={styles.delete} onClick={handleRemove}>
        <TrashIcon className={styles.icon} />
      </div>

      <picture className={styles.picture}>
        <img alt="" src={preview} />
      </picture>
    </div>
  )
}

export default AddPhotoPreview
