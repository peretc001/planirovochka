import React, { FC, useState } from 'react'
import { AutoComplete } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import { useDebouncedCallback } from '@/lib/useDebouncedCallback'

import { getCityApi } from './api/getCityApi'
import { ICityOption, ICitySuggestion } from './interface'

interface ICityAutocomplete {
  readonly defaultCity: string | undefined
  readonly onClearCity: () => void
  readonly onSelectCity: (option: ICityOption) => void
}

const CityAutocomplete: FC<ICityAutocomplete> = ({ defaultCity, onClearCity, onSelectCity }) => {
  const t = useTranslations('profile')

  const [cities, setCities] = useState<[] | ICitySuggestion[]>([])

  const { mutate } = useMutation({
    mutationFn: (query: string) => getCityApi(query),
    onSuccess: (data: ICitySuggestion[]) => {
      if (data?.length > 0) {
        setCities(data)
      } else {
        setCities([])
      }
    }
  })

  const loadCity = async (value: string) => mutate(value)

  const getCityDebounced = useDebouncedCallback<(city: string) => void>(loadCity, 500)

  const handleChangeCity = (value: string) => {
    if (value === '') onClearCity()

    getCityDebounced(value)
  }

  const citiesList = cities.map((city: ICitySuggestion) => ({
    id: city.data.city_kladr_id,
    label: city.value,
    value: city.value
  }))

  const onSelect = (data: string, option: ICityOption) => {
    onSelectCity(option)
  }

  return (
    <AutoComplete
      id="info_city"
      allowClear
      defaultValue={defaultCity}
      maxLength={255}
      options={citiesList}
      placeholder={t('info.city.placeholder')}
      onChange={handleChangeCity}
      onClear={onClearCity}
      onSelect={onSelect}
    />
  )
}

export default CityAutocomplete
