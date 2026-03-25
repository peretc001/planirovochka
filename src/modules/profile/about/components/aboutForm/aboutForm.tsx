import React, { FC, useEffect } from 'react'
import { Button, Form, Input, message, Select } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import CityAutocomplete from '@/shared/components/cityAutocomplete/cityAutocomplete'
import { ICityOption } from '@/shared/components/cityAutocomplete/interface'
import FileUpload from '@/shared/components/fileUpload/fileUpload'
import Loader from '@/shared/components/loader/loader'
import { IProfile } from '@/shared/interfaces'

import {
  DESIGN_EXPERIENCE,
  DESIGN_SEGMENT,
  DESIGN_STATUS,
  DESIGN_STYLES,
  DESIGN_TYPES
} from '@/constants'

import { addAvatarApi } from '@/modules/profile/about/api/addAvatarApi'
import { addProfileApi } from '@/modules/profile/about/api/addProfileApi'
import { deleteAvatarApi } from '@/modules/profile/about/api/deleteAvatarApi'

import SimpleEditor from '@/components/tiptap-templates/simple/simple-editor'

import styles from './aboutForm.module.scss'

interface IAboutForm {
  readonly profile: IProfile | null | undefined
}

const AboutForm: FC<IAboutForm> = ({ profile }) => {
  const t = useTranslations('profile')

  const [form] = Form.useForm()

  const avatar = Form.useWatch('avatar', form)
  // const telegram = Form.useWatch('telegram', form)
  // const telegramUrlRegex = /^https:\/\/t\.me\/[a-zA-Z0-9_]{3,}$/

  const { isLoading, mutate: save } = useMutation({
    mutationFn: (values: Record<string, unknown>) => addProfileApi(values),
    onError: () => message.error(t('error')),
    onSuccess: status => (status ? message.success(t('success')) : message.error(t('error')))
  })

  const { isLoading: isUploadLoading, mutate: uploadFile } = useMutation({
    mutationFn: (file: File) => addAvatarApi(file),
    onError: () => message.error(t('about.error')),
    onSuccess: url => {
      if (url) {
        form.setFieldValue('avatar', url)
      }
    }
  })

  const { isLoading: isDeletLoading, mutate: deleteFile } = useMutation({
    mutationFn: () => deleteAvatarApi(),
    onError: () => message.error(t('about.error')),
    onSuccess: status => {
      if (status) {
        form.resetFields(['avatar'])
      }
    }
  })

  const getHtmlChunks = (chunks: any) => <em>{chunks}</em>

  /* для фильтрации Select по label */
  const filterOption = (input: string, option?: { label?: string; value?: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  /* для выбора города */
  const handleSelectCity = (option: ICityOption) => {
    form.setFieldValue('city', option.label)
    form.setFieldValue('city_code', option.id)
  }

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

      <Form.Item hidden name="avatar">
        <Input />
      </Form.Item>

      <div className={styles.avatar}>
        <FileUpload
          isLoading={isUploadLoading || isDeletLoading}
          file={avatar}
          onDelete={deleteFile}
          onUpload={uploadFile}
        />
        <p>{t('about.avatar')}</p>
      </div>

      <div className={styles.name}>
        <Form.Item
          label={t('about.last_name.label')}
          name="last_name"
          rules={[
            { message: t('require'), required: true },
            { message: t('about.city.length'), min: 3 }
          ]}
        >
          <Input maxLength={255} placeholder={t('about.last_name.placeholder')} />
        </Form.Item>

        <Form.Item
          label={t('about.first_name.label')}
          name="first_name"
          rules={[
            { message: t('require'), required: true },
            { message: t('about.city.length'), min: 3 }
          ]}
        >
          <Input maxLength={255} placeholder={t('about.first_name.placeholder')} />
        </Form.Item>

        <Form.Item
          label={t('about.middle_name.label')}
          name="middle_name"
          rules={[
            { message: t('require'), required: true },
            { message: t('about.city.length'), min: 3 }
          ]}
        >
          <Input maxLength={255} placeholder={t('about.middle_name.placeholder')} />
        </Form.Item>
      </div>

      <Form.Item
        label={t.rich('about.city.label', { em: getHtmlChunks })}
        name="city"
        rules={[
          { message: t('require'), required: true },
          { message: t('about.city.length'), min: 3 },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (value && getFieldValue('city_code') !== '') {
                return Promise.resolve()
              }
              return Promise.reject(new Error(t('about.city.placeholder')))
            }
          })
        ]}
      >
        <CityAutocomplete defaultCity={profile?.city} onSelectCity={handleSelectCity} />
      </Form.Item>

      <Form.Item hidden name="city_code">
        <Input />
      </Form.Item>

      {/*<div className={styles.telegram}>*/}
      {/*  <Form.Item*/}
      {/*    label={t.rich('about.telegram.label', { em: getHtmlChunks })}*/}
      {/*    name="telegram"*/}
      {/*    rules={[*/}
      {/*      { message: t('require'), required: true },*/}
      {/*      { message: t('about.telegram.length'), min: 3 }*/}
      {/*    ]}*/}
      {/*  >*/}
      {/*    <Input placeholder={t('about.telegram.placeholder')} />*/}
      {/*  </Form.Item>*/}

      {/*  {telegram && telegramUrlRegex.test(telegram) ? (*/}
      {/*    <a*/}
      {/*      className={styles.test}*/}
      {/*      href={`${telegram}?text=test`}*/}
      {/*      rel="noreferrer"*/}
      {/*      target="_blank"*/}
      {/*    >*/}
      {/*      {t('about.telegram.test')}*/}
      {/*    </a>*/}
      {/*  ) : null}*/}
      {/*</div>*/}

      <div id="types" className={styles.separator} />

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

      <div className={styles.separator} />

      <Form.Item className={styles.editor} label={t('about.description.label')} name="description">
        <SimpleEditor defaultContent={profile?.description} onChange={handleChangeContent} />
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
