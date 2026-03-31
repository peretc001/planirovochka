'use client'

import React from 'react'
import { Button, Form, Input, message, Select, type UploadFile } from 'antd'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { DESIGN_TYPES, paths } from '@/constants'

import AddPhotos from '@/modules/profile/portfolio/add/components/addPhotos/addPhotos'
import { addPortfolioApi } from '@/modules/profile/portfolio/api/addPortfolioApi'

import SimpleEditor from '@/components/tiptap-templates/simple/simple-editor'

import styles from './addForm.module.scss'

const Add = () => {
  const t = useTranslations('profile')
  const router = useRouter()

  const [form] = Form.useForm()
  const description = Form.useWatch('description', form)

  /* для фильтрации Select по label */
  const filterOption = (input: string, option?: { label?: string; value?: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const { isLoading, mutate: save } = useMutation({
    mutationFn: (params: Parameters<typeof addPortfolioApi>[0]) => addPortfolioApi(params),
    onError: (err: unknown) => message.error(err instanceof Error ? err.message : String(err)),
    onSuccess: () => {
      message.success(t('portfolio.success'))
      router.replace(paths.profile.portfolio.index)
    }
  })

  const handleChangeContent = (html: React.ReactNode) => {
    form.setFieldValue('description', html)
  }

  const onFinish = async (values: {
    description?: string
    photos?: UploadFile[]
    price?: string
    title?: string
    type?: string
  }) => {
    const fileList = values.photos ?? []
    const files = fileList
      .map(f => f.originFileObj)
      .filter((f): f is NonNullable<typeof f> => Boolean(f)) as File[]

    await save({
      description: values.description ?? '',
      photos: files,
      price: String(values.price ?? ''),
      title: values.title ?? '',
      type: values.type ?? ''
    })
  }

  return (
    <Form
      className={styles.root}
      form={form}
      layout="vertical"
      name="portfolio"
      onFinish={onFinish}
    >
      {isLoading ? <Loader isFull /> : null}

      <h2>{t('portfolio.caption')}</h2>

      <Form.Item
        className={styles.title}
        label={t('portfolio.add.title.label')}
        name="title"
        rules={[
          { message: t('require'), required: true },
          { message: t('about.city.length'), min: 3 }
        ]}
      >
        <Input placeholder={t('portfolio.add.title.placeholder')} />
      </Form.Item>

      <Form.Item className={styles.title} label={t('portfolio.add.type.label')} name="type">
        <Select
          options={DESIGN_TYPES}
          placeholder={t('portfolio.add.type.placeholder')}
          showSearch={{ filterOption }}
        />
      </Form.Item>

      <Form.Item
        className={styles.editor}
        label={t('portfolio.add.description.label')}
        name="description"
      >
        <SimpleEditor defaultContent={description} limit={2000} onChange={handleChangeContent} />
      </Form.Item>
      <span className={styles.limit}>{t('portfolio.add.description.limit')}</span>

      <AddPhotos />

      <Form.Item
        className={styles.price}
        label={t('portfolio.add.price.label')}
        name="price"
        rules={[{ message: t('require'), required: true }]}
      >
        <Input placeholder={t('portfolio.add.price.placeholder')} type="number" />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" loading={isLoading} type="primary">
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Add
