import React, { FC, useState } from 'react'
import { Form, FormInstance, message } from 'antd'
import cns from 'classnames'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'

import { useMutation } from '@tanstack/react-query'

import { PhotoIcon } from '@heroicons/react/24/outline'

import { addAvatarApi } from '@/modules/profile/info/api/addAvatarApi'
// TODO: унести из shared
import { deleteAvatarApi } from '@/modules/profile/info/api/deleteAvatarApi'

import styles from './fileUpload.module.scss'

import FilePreview from '../filePreview/filePreview'

interface IFileUpload {
  readonly form: FormInstance
}

const FileUpload: FC<IFileUpload> = ({ form }) => {
  const t = useTranslations('profile')

  const avatar = Form.useWatch('avatar', form)

  const { isLoading: isUploadLoading, mutate: uploadFile } = useMutation({
    mutationFn: (file: File) => addAvatarApi(file),
    onError: () => message.error(t('info.error')),
    onSuccess: url => {
      if (url) form.setFieldValue('avatar', url)
    }
  })

  const { mutate: deleteFile } = useMutation({
    mutationFn: () => deleteAvatarApi(),
    onError: () => message.error(t('info.error')),
    onSuccess: status => {
      if (status) form.resetFields(['avatar'])
    }
  })

  const [isDragged, setIsDragged] = useState<boolean>(false)

  const { getInputProps, getRootProps } = useDropzone({
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDragEnter: () => {
      setIsDragged(true)
    },
    onDragLeave: () => {
      setIsDragged(false)
    },
    onDrop: acceptedFiles => {
      uploadFile(acceptedFiles[0])
      setIsDragged(false)
    },
    onDropRejected: async () => {
      message.error(t('info.upload.error'))
      setIsDragged(false)
    }
  })

  return (
    <section className={styles.root}>
      {avatar ? <FilePreview avatar={avatar} handleDeleteFile={deleteFile} /> : null}

      {!avatar && (
        // eslint-disable-next-line
        <div {...getRootProps({ className: 'dropzone' })}>
          <div
            className={cns(
              styles.add,
              isUploadLoading && styles.loading,
              isDragged && styles.dragged
            )}
          >
            <PhotoIcon className={styles.icon} />
          </div>
          <input
            // eslint-disable-next-line
            {...getInputProps()}
          />
        </div>
      )}
    </section>
  )
}

export default FileUpload
