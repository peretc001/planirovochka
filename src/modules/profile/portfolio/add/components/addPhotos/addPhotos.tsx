'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button, Form, Upload, type UploadFile, type UploadProps } from 'antd'
import { useTranslations } from 'next-intl'

import { getBase64 } from '@/lib/getBase64'

import AddPhotoPreview from '@/modules/profile/portfolio/add/components/addPhotoPreview/addPhotoPreview'

import styles from './addPhotos.module.scss'

import { UploadOutlined } from '@ant-design/icons'

const PHOTOS_LIMIT = 20

const AddPhotos = () => {
  const t = useTranslations('profile')
  const form = Form.useFormInstance()

  const watchedPhotos = Form.useWatch('photos', form)

  const fileList = useMemo(() => (watchedPhotos as UploadFile[] | undefined) ?? [], [watchedPhotos])
  const [previews, setPreviews] = useState<string[]>([])

  const handleRemovePhoto = (index: number) => {
    const next = fileList.filter((_, i) => i !== index)
    form.setFieldValue('photos', next)
  }

  const beforeUpload: UploadProps['beforeUpload'] = () => {
    if (fileList.length >= PHOTOS_LIMIT) return Upload.LIST_IGNORE
    return false
  }

  useEffect(() => {
    let cancelled = false

    void (async () => {
      const next: string[] = []
      for (const f of fileList) {
        if (f.originFileObj) {
          try {
            const preview = await getBase64(f.originFileObj)
            if (preview) next.push(preview)
          } catch {
            next.push('')
          }
        } else {
          next.push('')
        }
      }
      if (!cancelled) setPreviews(next)
    })()

    return () => {
      cancelled = true
    }
  }, [fileList])

  return (
    <div className={styles.root}>
      {fileList.length > 0 && (
        <div className={styles.previewList}>
          {previews.map((preview, index) => (
            <AddPhotoPreview
              key={fileList[index]?.uid ?? index}
              index={index}
              preview={preview}
              onRemove={handleRemovePhoto}
            />
          ))}
        </div>
      )}

      <Form.Item
        getValueFromEvent={e => e?.fileList?.slice(0, PHOTOS_LIMIT) ?? []}
        name="photos"
        rules={[{ message: t('require'), required: true }]}
        valuePropName="fileList"
      >
        <Upload
          accept="image/jpg, image/jpeg, image/png, image/gif, image/webp"
          beforeUpload={beforeUpload}
          maxCount={PHOTOS_LIMIT}
          multiple
          showUploadList={false}
        >
          <Button color="primary" icon={<UploadOutlined />} variant="outlined">
            {t('portfolio.add.photos.label')}
          </Button>
        </Upload>
      </Form.Item>

      <span className={styles.limit}>
        {t.rich('portfolio.add.photos.limit', { limit: PHOTOS_LIMIT })}
      </span>
    </div>
  )
}

export default AddPhotos
