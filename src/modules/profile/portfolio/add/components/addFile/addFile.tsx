import React from 'react'
import { Button, Form, Upload } from 'antd'
import { useTranslations } from 'next-intl'

import { TrashIcon } from '@heroicons/react/24/outline'

import styles from './addFile.module.scss'

import { UploadOutlined } from '@ant-design/icons'

const AddFile = () => {
  const t = useTranslations('profile')
  const form = Form.useFormInstance()

  const watchedFile = Form.useWatch('file', form)

  const handleRemoveFile = () => {
    form.resetFields(['file'])
  }

  return (
    <div className={styles.root}>
      <Form.Item
        getValueFromEvent={e => e?.fileList?.slice(0, 1) ?? []}
        label={t('portfolio.add.file.label')}
        name="file"
        valuePropName="fileList"
      >
        <Upload accept="application/pdf" disabled={watchedFile} maxCount={1} showUploadList={false}>
          <Button
            color="primary"
            disabled={watchedFile}
            icon={<UploadOutlined />}
            variant="outlined"
          >
            {t('portfolio.add.file.button')}
          </Button>
        </Upload>
      </Form.Item>
      <span className={styles.description}>{t('portfolio.add.file.description')}</span>

      {watchedFile ? (
        <div className={styles.file}>
          <img className={styles.icon} src="/icons/types/pdf.svg" />
          <div className={styles.name}>{watchedFile[0].name}</div>

          <TrashIcon className={styles.remove} onClick={handleRemoveFile} />
        </div>
      ) : null}
    </div>
  )
}

export default AddFile
