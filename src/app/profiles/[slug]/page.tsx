import { FC } from 'react'
import { notFound } from 'next/navigation'

import serverApi from '@/lib/serverApi'

import Profile from '@/modules/profiles'

type Props = {
  readonly params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug

  const profile = await serverApi.get('profiles/' + slug)

  const data = profile?.data

  const name = [data?.last_name, data?.first_name, data?.middle_name].join(' ')

  return {
    description: data?.description,
    title: name + ' - ' + data.statusLabel + ' на ' + process.env.NEXT_PUBLIC_NAME + '.io'
  }
}

const Page: FC<Props> = async ({ params }) => {
  const { slug } = await params

  const profile = await serverApi.get('profiles/' + slug)

  if (!profile?.data) return notFound()

  return <Profile profile={profile?.data} />
}

export default Page
