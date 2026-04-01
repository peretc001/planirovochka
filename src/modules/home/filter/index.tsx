'use client'

import React, { FC } from 'react'
import cns from 'classnames'

import Additional from '@/modules/home/filter/components/additional'
import City from '@/modules/home/filter/components/city'
import Groups from '@/modules/home/filter/components/groups'
import Name from '@/modules/home/filter/components/name'

import styles from './filter.module.scss'

interface IFilter {
  readonly isMobile?: boolean
}

const Filter: FC<IFilter> = ({ isMobile }) => (
  <div className={cns(styles.root, isMobile && styles.mobile)}>
    {/*<Name />*/}
    {/*<City />*/}
    <Additional />
    <Groups />
  </div>
)

export default Filter
