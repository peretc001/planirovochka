import React, { FC } from 'react'

import styles from './filePreview.module.scss'

import { XMarkIcon } from '@heroicons/react/24/outline'

interface IFilePreview {
  readonly avatar: string
  readonly handleDeleteFile: () => void
}

const FilePreview: FC<IFilePreview> = ({ avatar, handleDeleteFile }) => (
  <div className={styles.root}>
    <div className={styles.delete} onClick={handleDeleteFile}>
      <XMarkIcon className={styles.icon} />
    </div>

    <div className={styles.preview}>
      {avatar ? <img alt="" src={process.env.NEXT_PUBLIC_URL + avatar} /> : null}
    </div>
  </div>
)

export default FilePreview
