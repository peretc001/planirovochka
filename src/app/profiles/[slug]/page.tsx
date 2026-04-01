import { FC } from 'react'
import { notFound } from 'next/navigation'

import { CURRENCY, DESIGN_EXPERIENCE, DESIGN_TYPES } from '@/constants'

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
  const price = data?.prices?.['dizayn-proekt_min'] || data?.prices?.['dizayn-proekt_max']
  const portfolio = data?.portfolio?.length
  const experience = data?.experience

  const generateDescription = (
    price: string | undefined,
    portfolio: number | undefined,
    experience: string | undefined
  ) => {
    let description

    if (price) description = DESIGN_TYPES[0].label + ' - ' + price + ' ' + CURRENCY
    if (portfolio) description = description + ' Более ' + portfolio + ' выполненных работ.'
    if (experience)
      description =
        description + ' Опыт работы: ' + DESIGN_EXPERIENCE.find(x => x.value === experience)?.label

    return description
  }

  const description = generateDescription(price, portfolio, experience)

  return {
    description: description,
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
