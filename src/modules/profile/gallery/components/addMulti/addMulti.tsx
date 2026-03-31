import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Form, message, Radio, Upload, UploadFile, UploadProps } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { GALLERY_TYPES } from '@/constants'

import { getBase64 } from '@/lib/getBase64'

import { addGalleryApi } from '@/modules/profile/gallery/api/addGalleryApi'

import SimpleEditor from '@/components/tiptap-templates/simple/simple-editor'

import styles from './addMulti.module.scss'

import { UploadOutlined } from '@ant-design/icons'

interface IGalleryAdd {
  readonly onCancel: () => void
}

const AddMulti: FC<IGalleryAdd> = ({ onCancel }) => {
  const t = useTranslations('profile')

  const queryClient = useQueryClient()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [form] = Form.useForm()

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const description = Form.useWatch('description', form)

  const { isLoading: isUploadLoading, mutate: save } = useMutation({
    mutationFn: (params: any) => addGalleryApi(params),
    onError: () => message.error(t('gallery.upload.error')),
    onSuccess: url => {
      if (url) {
        queryClient.invalidateQueries({ queryKey: ['gallery'] })
        if (onCancel) onCancel()
      }
    }
  })

  const handleLoadPreview = async (files: any) => {
    const preview = await getBase64(files.file)
    if (preview) setPreviews(prev => (prev ? [...prev, preview] : [preview]))
  }

  const handleRemovePreview = () => {
    form.resetFields(['file'])
    setFileList([])
    setPreviews([])
  }

  const props: UploadProps = {
    accept: 'image/jpg, image/jpeg, image/png, image/gif, image/webp',
    beforeUpload: (file, fileList) => {
      handleRemovePreview()
      setFileList(fileList)

      return false
    },
    fileList,
    maxCount: 50,
    multiple: true,
    showUploadList: false,
    onChange: handleLoadPreview
  }

  const handleChangeContent = (html: React.ReactNode) => {
    form.setFieldValue('description', html)
  }

  const onFinish = async (values: any) => {
    if (!values.file?.file) return

    for (let i = 0; i < fileList.length; i++) {
      await save({ description: values.description, file: fileList[i], type: values.type })
    }
  }

  useEffect(() => {
    const handleReset = () => {
      form.resetFields(['file', 'type', 'description'])
      setFileList([])
      setPreviews([])
    }

    return () => handleReset()
  }, [])

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={{ description: undefined, file: undefined, type: 'visual' }}
      layout="vertical"
      name="gallery"
      onFinish={onFinish}
    >
      <h2>{t('gallery.title_multi')}</h2>

      <Form.Item name="file" rules={[{ message: t('require'), required: true }]}>
        <Upload {...props}>
          <Button color="primary" icon={<UploadOutlined />} variant="outlined">
            {t('gallery.file_multi')}
          </Button>
        </Upload>
      </Form.Item>

      <div className={styles.previewList}>
        {previews.map(file => (
          <div key={file} className={styles.preview}>
            <picture className={styles.picture}>
              <img alt="" src={file} />
            </picture>
          </div>
        ))}
      </div>

      <Form.Item label={t('gallery.type')} name="type">
        <Radio.Group options={GALLERY_TYPES} value="visual" />
      </Form.Item>

      <Form.Item className={styles.editor} label={t('gallery.description')} name="description">
        <SimpleEditor defaultContent={description} limit={100} onChange={handleChangeContent} />
      </Form.Item>

      <Form.Item>
        <Button ref={buttonRef} htmlType="submit" loading={isUploadLoading} type="primary">
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddMulti
