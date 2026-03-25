'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getProfilesApi } from '@/modules/home/list/api/getProfilesApi'
import Cards from '@/modules/home/list/components/cards/cards'
import Empty from '@/modules/home/list/components/empty/empty'

import cssStyles from './list.module.scss'

const List = () => {
  const searchParams = useSearchParams() as URLSearchParams

  const name = searchParams.get('query') ?? undefined
  const city = searchParams.get('city') ?? undefined
  const types = searchParams.get('types')?.split(',') ?? undefined
  const styles = searchParams.get('styles')?.split(',') ?? undefined
  const segments = searchParams.get('segments')?.split(',') ?? undefined
  const experience = searchParams.get('experience')?.split(',') ?? undefined
  const status = searchParams.get('status')?.split(',') ?? undefined

  const { isError, isLoading, data } = useQuery({
    queryFn: () => getProfilesApi(name, city, types, styles, segments, experience, status),
    queryKey: ['profiles_list', name, city, types, styles, segments, experience, status]
  })

  return (
    <div className={cssStyles.root}>
      {isLoading ? <Loader className={cssStyles.loader} isFull /> : null}

      {data?.length > 0 && <Cards cards={data} />}

      {!isLoading && data?.length === 0 ? <Empty /> : null}
      {isError && !data?.length ? <Empty /> : null}
    </div>
  )
}

export default List
