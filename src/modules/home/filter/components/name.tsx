import React, { useRef, useState } from 'react'
import { Input, InputRef } from 'antd'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { XMarkIcon } from '@heroicons/react/24/outline'

import styles from '@/modules/home/filter/filter.module.scss'

const Name = () => {
  const t = useTranslations('filter')

  const inputRef = useRef<InputRef | null>(null)

  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams() as URLSearchParams

  const [search, setSearch] = useState(searchParams.get('query') ?? '')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearch(term)

    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const handleSearchClear = () => {
    setSearch('')

    const params = new URLSearchParams(searchParams)
    params.delete('query')
    replace(`${pathname}?${params.toString()}`)

    if (inputRef.current) inputRef.current.focus()
  }

  return (
    <div className={styles.group}>
      <label htmlFor="search">{t('search.title')}</label>
      <div className={styles.search}>
        <Input
          ref={inputRef}
          id="search"
          placeholder={t('search.placeholder')}
          rootClassName={styles.input_wrapper}
          value={search}
          onChange={handleSearch}
        />
        {search ? <XMarkIcon className={styles.clear} onClick={handleSearchClear} /> : null}
      </div>
    </div>
  )
}

export default Name
