import React, { FC, useEffect } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import FileUpload from '@/shared/components/fileUpload/fileUpload'
import Loader from '@/shared/components/loader/loader'

import { addInfoApi } from '@/modules/profile/info/api/addInfoApi'
import ProfileFormAutocomplete from '@/modules/profile/info/components/profileForm/profileFormAutocomplete'
import { ICityOption } from '@/modules/profile/info/interface'

import styles from './profileForm.module.scss'

interface IProfileForm {
  readonly profile: any
}

const ProfileForm: FC<IProfileForm> = ({ profile }) => {
  const t = useTranslations('profile')

  const [form] = Form.useForm()

  const telegram = Form.useWatch('telegram', form)
  const telegramUrlRegex = /^https:\/\/t\.me\/[a-zA-Z0-9_]{3,}$/

  const { isLoading, mutate: save } = useMutation({
    mutationFn: (values: any) => addInfoApi(values),
    onError: () => message.error(t('error')),
    onSuccess: status => (status ? message.success(t('success')) : message.error(t('error')))
  })

  const getHtmlChunks = (chunks: any) => <em>{chunks}</em>

  /* для выбора города */
  const handleSelectCity = (option: ICityOption) => {
    form.setFieldValue('city', option.label)
    form.setFieldValue('city_code', option.id)
  }

  /* очистка города */
  const handleClearCity = () => {
    form.resetFields(['city', 'city_code'])
  }

  const onFinish = async (values: any) => {
    await save(values)
  }

  useEffect(() => {
    if (profile) form.setFieldsValue(profile)
  }, [profile])

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={!profile ? { telegram: 'https://t.me/' } : undefined}
      layout="vertical"
      name="info"
      onFinish={onFinish}
    >
      {isLoading ? <Loader isFull /> : null}

      <div className={styles.avatar}>
        <Form.Item name="avatar">
          <FileUpload form={form} />
        </Form.Item>
        <p>{t('info.avatar')}</p>
      </div>

      <Form.Item
        label={t('info.name.label')}
        name="name"
        rules={[
          { message: t('require'), required: true },
          { message: t('info.city.length'), min: 3 }
        ]}
      >
        <Input maxLength={255} placeholder={t('info.name.placeholder')} />
      </Form.Item>

      <Form.Item
        label={t.rich('info.city.label', { em: getHtmlChunks })}
        name="city"
        rules={[
          { message: t('require'), required: true },
          { message: t('info.city.length'), min: 3 }
        ]}
      >
        <ProfileFormAutocomplete
          defaultCity={profile?.city}
          onClearCity={handleClearCity}
          onSelectCity={handleSelectCity}
        />
      </Form.Item>

      <div className={styles.telegram}>
        <Form.Item
          label={t.rich('info.telegram.label', { em: getHtmlChunks })}
          name="telegram"
          rules={[
            { message: t('require'), required: true },
            { message: t('info.telegram.length'), min: 3 }
          ]}
        >
          <Input placeholder={t('info.telegram.placeholder')} />
        </Form.Item>

        {telegram && telegramUrlRegex.test(telegram) ? (
          <a
            className={styles.test}
            href={`${telegram}?text=test`}
            rel="noreferrer"
            target="_blank"
          >
            {t('info.telegram.test')}
          </a>
        ) : null}
      </div>

      <Form.Item>
        <Button htmlType="submit" type="primary">
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ProfileForm
