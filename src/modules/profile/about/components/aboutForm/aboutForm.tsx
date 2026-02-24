import React, { FC, useEffect } from 'react'
import { Button, Form, message, Select } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import {
  DESIGN_EXPERIENCE,
  DESIGN_SEGMENT,
  DESIGN_STATUS,
  DESIGN_STYLES,
  DESIGN_TYPES
} from '@/constants'

import { addAboutApi } from '@/modules/profile/about/api/addAboutApi'

import styles from './aboutForm.module.scss'

import Editor from '../editor/editor'

interface IAboutForm {
  readonly profile: any
}

const AboutForm: FC<IAboutForm> = ({ profile }) => {
  const t = useTranslations('profile')

  const [form] = Form.useForm()
  const content = Form.useWatch('description', form)

  const { isLoading, mutate: save } = useMutation({
    mutationFn: values => addAboutApi(values),
    onError: () => message.error(t('error')),
    onSuccess: status => (status ? message.success(t('success')) : message.error(t('error')))
  })

  const getHtmlChunks = (chunks: any) => <em>{chunks}</em>

  /* для фильтрации Select по label */
  const filterOption = (input: string, option?: { label?: string; value?: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const handleChangeContent = (html: React.ReactNode) => {
    form.setFieldValue('description', html)
  }

  const onFinish = async (values: any) => {
    await save(values)
  }

  useEffect(() => {
    if (profile) form.setFieldsValue(profile)
  }, [profile])

  return (
    <Form className={styles.root} form={form} layout="vertical" name="about" onFinish={onFinish}>
      {isLoading ? <Loader isFull /> : null}

      <Form.Item
        className={styles.editor}
        label={t('about.description.label')}
        name="description"
        rules={[{ message: t('require'), required: true }]}
      >
        <Editor
          content={content}
          defaultContent={profile?.description}
          onChange={handleChangeContent}
        />
      </Form.Item>

      <Form.Item
        label={t.rich('about.types.label', {
          em: getHtmlChunks
        })}
        name="types"
        rules={[{ message: t('require'), required: true }]}
      >
        <Select
          mode="multiple"
          options={DESIGN_TYPES}
          placeholder={t('about.types.placeholder')}
          showSearch={{ filterOption }}
        />
      </Form.Item>

      <Form.Item
        label={t.rich('about.styles.label', { em: getHtmlChunks })}
        name="styles"
        rules={[{ message: t('require'), required: true }]}
      >
        <Select
          mode="multiple"
          options={DESIGN_STYLES}
          placeholder={t('about.styles.placeholder')}
          showSearch={{ filterOption }}
        />
      </Form.Item>

      <Form.Item
        label={t.rich('about.segments.label', { em: getHtmlChunks })}
        name="segments"
        rules={[{ message: t('require'), required: true }]}
      >
        <Select
          mode="multiple"
          options={DESIGN_SEGMENT}
          placeholder={t('about.segments.placeholder')}
        />
      </Form.Item>

      <Form.Item
        label={t('about.experience.label')}
        name="experience"
        rules={[{ message: t('require'), required: true }]}
      >
        <Select options={DESIGN_EXPERIENCE} placeholder={t('about.experience.placeholder')} />
      </Form.Item>

      <Form.Item
        label={t('about.status.label')}
        name="status"
        rules={[{ message: t('require'), required: true }]}
      >
        <Select options={DESIGN_STATUS} placeholder={t('about.status.placeholder')} />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" type="primary">
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AboutForm
