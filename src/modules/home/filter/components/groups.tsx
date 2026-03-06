import React from 'react'
import { Checkbox, CheckboxOptionType, GetProp } from 'antd'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import {
  DESIGN_EXPERIENCE,
  DESIGN_SEGMENT,
  DESIGN_STATUS,
  DESIGN_STYLES,
  DESIGN_TYPES
} from '@/constants'

import styles from '@/modules/home/filter/filter.module.scss'

const Groups = () => {
  const t = useTranslations('filter')

  const GROUPS = ['types', 'styles', 'segments', 'experience', 'status']

  const OPTIONS = (group: string) => {
    if (group === 'types') return DESIGN_TYPES
    if (group === 'styles') return DESIGN_STYLES
    if (group === 'segments') return DESIGN_SEGMENT
    if (group === 'experience') return DESIGN_EXPERIENCE
    if (group === 'status') return DESIGN_STATUS
  }

  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams() as URLSearchParams

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> =
    (group: string) => (checkedValues: CheckboxOptionType) => {
      const params = new URLSearchParams(searchParams)

      if (checkedValues.length > 0) {
        params.set(group, checkedValues.toString())
      } else {
        params.delete(group)
      }
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

  return GROUPS.map(group => (
    <div key={group} className={styles.group}>
      <label htmlFor={group}>{t.rich(`about.${group}.label`)}</label>
      <Checkbox.Group
        className={styles.checkbox}
        defaultValue={['']}
        options={OPTIONS(group)}
        onChange={onChange(group)}
      />
    </div>
  ))
}

export default Groups
