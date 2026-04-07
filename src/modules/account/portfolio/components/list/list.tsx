import React, { FC } from 'react'
import { Button } from 'antd'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { PlusIcon } from '@heroicons/react/24/outline'

import { IPortfolio } from '@/shared/interfaces'

import { paths } from '@/constants'

import Card from '@/modules/account/portfolio/components/card/card'

import styles from './list.module.scss'

interface IPortfolioList {
  readonly list: IPortfolio[]
}

const List: FC<IPortfolioList> = ({ list }) => {
  const t = useTranslations('account')

  return (
    <div className={styles.root}>
      <Link className={styles.add} href={paths.account.portfolio.add}>
        <Button type="primary">
          <PlusIcon className={styles.icon} />
          {t('portfolio.caption')}
        </Button>
      </Link>

      <div className={styles.list}>
        {list?.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}

export default List
