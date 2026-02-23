import React, { FC, useEffect } from 'react'
import { Button, Form, Input, message, Select } from 'antd'
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

interface IAboutForm {
  readonly profile: any
}

const AboutForm: FC<IAboutForm> = ({ profile }) => {
  const t = useTranslations('profile')

  const [form] = Form.useForm()

  const { isLoading, mutate: save } = useMutation({
    mutationFn: values => addAboutApi(values),
    onError: () => message.error(t('info.error')),
    onSuccess: status =>
      status ? message.success(t('info.success')) : message.error(t('info.error'))
  })

  const getHtmlChunks = (chunks: string) => <em>{chunks}</em>

  /* для фильтрации Select по label */
  const filterOption = (input: string, option?: { label?: string; value?: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const onFinish = async (values: any) => {
    await save(values)
  }

  useEffect(() => {
    if (profile) form.setFieldsValue(profile)
  }, [profile])

  return (
    <Form className={styles.root} form={form} layout="vertical" name="about" onFinish={onFinish}>
      {isLoading ? <Loader isFull /> : null}

      <Form.Item hidden name="owner_id">
        <Input />
      </Form.Item>

      <Form.Item
        label={t.rich('info.types.label', { em: getHtmlChunks })}
        name="types"
        rules={[{ message: t('info.require'), required: true }]}
      >
        <Select
          mode="multiple"
          options={DESIGN_TYPES}
          placeholder={t('info.types.placeholder')}
          showSearch={{ filterOption }}
        />
      </Form.Item>

      <Form.Item
        label={t.rich('info.styles.label', { em: getHtmlChunks })}
        name="styles"
        rules={[{ message: t('info.require'), required: true }]}
      >
        <Select
          mode="multiple"
          options={DESIGN_STYLES}
          placeholder={t('info.styles.placeholder')}
          showSearch={{ filterOption }}
        />
      </Form.Item>

      <Form.Item
        label={t.rich('info.segments.label', { em: getHtmlChunks })}
        name="segments"
        rules={[{ message: t('info.require'), required: true }]}
      >
        <Select
          mode="multiple"
          options={DESIGN_SEGMENT}
          placeholder={t('info.segments.placeholder')}
        />
      </Form.Item>

      <Form.Item
        label={t('info.experience.label')}
        name="experience"
        rules={[{ message: t('info.require'), required: true }]}
      >
        <Select options={DESIGN_EXPERIENCE} placeholder={t('info.experience.placeholder')} />
      </Form.Item>

      <Form.Item
        label={t('info.status.label')}
        name="status"
        rules={[{ message: t('info.require'), required: true }]}
      >
        <Select options={DESIGN_STATUS} placeholder={t('info.status.placeholder')} />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" type="primary">
          {t('info.save')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AboutForm
