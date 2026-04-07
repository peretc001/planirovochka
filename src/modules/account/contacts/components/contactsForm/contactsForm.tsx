import React, { FC } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'

import Loader from '@/shared/components/loader/loader'
import { IContacts } from '@/shared/interfaces'

import { addContactsApi } from '@/modules/account/contacts/api/addContactsApi'

import styles from './contactsForm.module.scss'

interface IAboutForm {
  readonly contacts: IContacts | undefined
}

const ContactsForm: FC<IAboutForm> = ({ contacts }) => {
  const t = useTranslations('account')

  const [form] = Form.useForm()

  const telegram = Form.useWatch('telegram', form)
  const telegramUrlRegex = /^https:\/\/t\.me\/.{2,30}$/

  const max = Form.useWatch('max', form)
  const maxUrlRegex = /^https:\/\/max\.ru\/u\/.{2,100}$/

  const instagram = Form.useWatch('instagram', form)
  const instagramUrlRegex = /^https:\/\/(www\.)?instagram\.com\/.{2,30}$/

  const pinterest = Form.useWatch('pinterest', form)
  const pinterestUrlRegex = /^https:\/\/pin\.it\/.{2,30}$/

  const { isLoading, mutate: save } = useMutation({
    mutationFn: (values: Record<string, unknown>) => addContactsApi(values),
    onError: () => message.error(t('error')),
    onSuccess: status => (status ? message.success(t('success')) : message.error(t('error')))
  })

  const onFinish = async (values: any) => {
    await save(values)
  }

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={contacts}
      layout="vertical"
      name="contacts"
      onFinish={onFinish}
    >
      {isLoading ? <Loader isFull /> : null}

      <div className={styles.description}>{t('contacts.messengers')}</div>

      <div className={styles.contacts}>
        <div className={styles.group}>
          <Form.Item
            className={styles.contact}
            label={t('contacts.telegram.label')}
            name="telegram"
            rules={[{ message: t('contacts.telegram.length'), min: 3 }]}
          >
            <Input placeholder={t('contacts.telegram.placeholder')} />
          </Form.Item>

          {telegram && telegramUrlRegex.test(telegram) ? (
            <a className={styles.link} href={telegram} rel="noreferrer" target="_blank">
              <ArrowTopRightOnSquareIcon className={styles.icon} />
            </a>
          ) : null}
        </div>

        <div className={styles.group}>
          <Form.Item
            className={styles.contact}
            label={t('contacts.max.label')}
            name="max"
            rules={[{ message: t('contacts.max.length'), min: 3 }]}
          >
            <Input placeholder={t('contacts.max.placeholder')} />
          </Form.Item>

          {max && maxUrlRegex.test(max) ? (
            <a className={styles.link} href={max} rel="noreferrer" target="_blank">
              <ArrowTopRightOnSquareIcon className={styles.icon} />
            </a>
          ) : null}
        </div>
      </div>

      <div className={styles.description}>{t('contacts.socials')}</div>

      <div className={styles.contacts}>
        <div className={styles.group}>
          <Form.Item
            className={styles.contact}
            label={t('contacts.instagram.label')}
            name="instagram"
            rules={[{ message: t('contacts.instagram.length'), min: 3 }]}
          >
            <Input placeholder={t('contacts.instagram.placeholder')} />
          </Form.Item>

          {instagram && instagramUrlRegex.test(instagram) ? (
            <a className={styles.link} href={instagram} rel="noreferrer" target="_blank">
              <ArrowTopRightOnSquareIcon className={styles.icon} />
            </a>
          ) : null}
        </div>

        <div className={styles.group}>
          <Form.Item
            className={styles.contact}
            label={t('contacts.pinterest.label')}
            name="pinterest"
            rules={[{ message: t('contacts.pinterest.length'), min: 3 }]}
          >
            <Input placeholder={t('contacts.pinterest.placeholder')} />
          </Form.Item>

          {pinterest && pinterestUrlRegex.test(pinterest) ? (
            <a className={styles.link} href={pinterest} rel="noreferrer" target="_blank">
              <ArrowTopRightOnSquareIcon className={styles.icon} />
            </a>
          ) : null}
        </div>
      </div>

      <Form.Item>
        <Button htmlType="submit" type="primary">
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ContactsForm
