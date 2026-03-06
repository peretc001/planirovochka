'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { getProfilesApi } from '@/modules/home/list/api/getProfilesApi'
import Cards from '@/modules/home/list/components/cards/cards'

const List = () => {
  const searchParams = useSearchParams() as URLSearchParams

  const types = searchParams.get('types')?.split(',') ?? undefined
  const styles = searchParams.get('styles')?.split(',') ?? undefined
  const segments = searchParams.get('segments')?.split(',') ?? undefined
  const experience = searchParams.get('experience')?.split(',') ?? undefined
  const status = searchParams.get('status')?.split(',') ?? undefined

  const { isLoading, data } = useQuery({
    queryFn: () => getProfilesApi(types, styles, segments, experience, status),
    queryKey: ['profiles_list', types, styles, segments, experience, status]
  })

  return (
    <div>
      {isLoading ? 'loading' : null}

      {data?.length > 0 && <Cards cards={data} />}
    </div>
  )
}

export default List
