'use client'

import React, { FC } from 'react'
import cns from 'classnames'

import Additional from '@/modules/catalog/search/filter/components/additional'
import City from '@/modules/catalog/search/filter/components/city'
import Groups from '@/modules/catalog/search/filter/components/groups'
import Name from '@/modules/catalog/search/filter/components/name'

import styles from './filter.module.scss'

interface IFilter {
  readonly isMobile?: boolean
}

const Filter: FC<IFilter> = ({ isMobile }) => (
  <div className={cns(styles.root, isMobile && styles.mobile)}>
    {/*<Name />*/}
    {/*<City />*/}
    <Groups />
    <Additional />
  </div>
)

export default Filter
