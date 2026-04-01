import React, { FC } from 'react'
import { Button, Form, Input, message } from 'antd'
import cns from 'classnames'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'
import { IPrices, IType } from '@/shared/interfaces'

import { CURRENCY, DESIGN_TYPES, paths } from '@/constants'

import { addPricesApi } from '@/modules/profile/prices/api/addPricesApi'

import styles from './list.module.scss'

interface IPricesList {
  readonly prices: IPrices | undefined
  readonly types: string[] | undefined
}

const List: FC<IPricesList> = ({ prices, types }) => {
  const t = useTranslations('profile')

  const getHtmlChunks = (chunks: any) => <sup>{chunks}</sup>

  const [form] = Form.useForm()

  const allowed = DESIGN_TYPES.filter((designType: IType) => types?.includes(designType.value))

  const { isLoading, mutate: save } = useMutation({
    mutationFn: values => addPricesApi(values),
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
      initialValues={prices}
      layout="vertical"
      name="prices"
      onFinish={onFinish}
    >
      {isLoading ? <Loader isFull /> : null}

      {allowed?.map(type => (
        <div key={type.value} className={styles.row}>
          <div className={styles.title}>{type.label}</div>

          <div className={cns(styles.price, styles.min)}>
            {t('prices.from')}
            <Form.Item name={type.value + '_min'}>
              <Input id={type.value + '_min'} type="number" />
            </Form.Item>
          </div>

          <div className={cns(styles.price, styles.max)}>
            {t('prices.to')}
            <Form.Item name={type.value + '_max'}>
              <Input id={type.value + '_max'} type="number" />
            </Form.Item>
          </div>

          <div className={styles.type}>
            {CURRENCY}/{t.rich('prices.' + type.unit, { sup: getHtmlChunks })}
          </div>
        </div>
      ))}

      <div className={styles.description}>
        {t.rich('prices.description', {
          a: text => <Link href={paths.profile.about + '#types'}>{text}</Link>
        })}
      </div>

      {allowed?.length > 0 && (
        <Form.Item>
          <Button htmlType="submit" loading={isLoading} type="primary">
            {t('save')}
          </Button>
        </Form.Item>
      )}
    </Form>
  )
}

export default List
