import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import CityAutocomplete from '@/shared/components/cityAutocomplete/cityAutocomplete'
import { ICityOption } from '@/shared/components/cityAutocomplete/interface'

import styles from '@/modules/home/filter/filter.module.scss'

const City = () => {
  const t = useTranslations('filter')

  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams() as URLSearchParams

  const handleSelectCity = (city: ICityOption) => {
    const params = new URLSearchParams(searchParams)

    if (city.id) {
      params.set('city', city.label)
    } else {
      params.delete('city')
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleClearCity = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('city')
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={styles.group}>
      <label htmlFor="city">{t('city.title')}</label>
      <CityAutocomplete
        defaultCity=""
        onClearCity={handleClearCity}
        onSelectCity={handleSelectCity}
      />
    </div>
  )
}

export default City
