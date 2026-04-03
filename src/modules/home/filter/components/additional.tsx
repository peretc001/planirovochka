import React from 'react'
import { Checkbox } from 'antd'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import styles from '@/modules/home/filter/filter.module.scss'

const Additional = () => {
  const t = useTranslations('filter')

  const GROUPS = ['portfolio', 'inspected']

  const OPTIONS = (group: string) => {
    if (group === 'portfolio') return [{ label: 'Только с портфолио', value: '1' }]
    if (group === 'inspected') return [{ label: 'Возможно без авторского надзора', value: '1' }]
  }

  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams() as URLSearchParams

  const onChange = (group: string) => (checkedValues: (number | string)[]) => {
    const params = new URLSearchParams(searchParams)

    if (checkedValues.length > 0) {
      params.set(group, checkedValues.toString())
    } else {
      params.delete(group)
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className={styles.group}>
      <label>{t.rich('additional.title')}</label>

      {GROUPS.map(group => (
        <Checkbox.Group
          key={group}
          className={styles.checkbox}
          options={OPTIONS(group) ?? []}
          value={searchParams.get(group)?.split(',').filter(Boolean) ?? []}
          onChange={checkedValues => onChange(group)(checkedValues)}
        />
      ))}
    </div>
  )
}

export default Additional
