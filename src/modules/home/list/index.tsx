'use client'

import React from 'react'
import { Button } from 'antd'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { useInfiniteQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { PROFILE_LIST_LIMIT } from '@/constants'

import { getProfilesApi, type ProfilesListResponse } from '@/modules/home/list/api/getProfilesApi'
import Cards from '@/modules/home/list/components/cards/cards'
import Empty from '@/modules/home/list/components/empty/empty'

import cssStyles from './list.module.scss'

const List = () => {
  const t = useTranslations('home')

  const searchParams = useSearchParams() as URLSearchParams

  const name = searchParams.get('query') ?? undefined
  const city = searchParams.get('city') ?? undefined
  const types = searchParams.get('types')?.split(',') ?? undefined
  const styles = searchParams.get('styles')?.split(',') ?? undefined
  const segments = searchParams.get('segments')?.split(',') ?? undefined
  const experience = searchParams.get('experience')?.split(',') ?? undefined
  const status = searchParams.get('status')?.split(',') ?? undefined
  const portfolio = searchParams.get('portfolio') ?? undefined
  const inspected = searchParams.get('inspected') ?? undefined

  const { hasNextPage, isError, isFetchingNextPage, isLoading, data, fetchNextPage } =
    useInfiniteQuery<ProfilesListResponse>({
      getNextPageParam: lastPage =>
        lastPage.currentPage * PROFILE_LIST_LIMIT < lastPage.total
          ? lastPage.currentPage + 1
          : undefined,
      queryFn: async ({ pageParam }) => {
        const page = typeof pageParam === 'number' ? pageParam : 1
        const res = await getProfilesApi(
          page,
          PROFILE_LIST_LIMIT,
          name,
          city,
          types,
          styles,
          segments,
          experience,
          status,
          portfolio,
          inspected
        )
        return res ?? { currentPage: page, list: [], total: 0 }
      },
      queryKey: [
        'profiles_list',
        name,
        city,
        types,
        styles,
        segments,
        experience,
        status,
        portfolio,
        inspected
      ]
    })

  const cards = data?.pages.flatMap(p => p.list) ?? []

  const handleShowMore = () => {
    fetchNextPage()
  }

  return (
    <div className={cssStyles.root}>
      {isLoading ? <Loader className={cssStyles.loader} isFull /> : null}

      {cards.length > 0 && <Cards cards={cards} />}

      {hasNextPage ? (
        <div className={cssStyles.show}>
          <Button loading={isFetchingNextPage} type="primary" onClick={handleShowMore}>
            {t.rich('show', { count: PROFILE_LIST_LIMIT })}
          </Button>
        </div>
      ) : null}

      {!isLoading && cards.length === 0 ? <Empty /> : null}
      {isError && cards.length === 0 ? <Empty /> : null}
    </div>
  )
}

export default List
