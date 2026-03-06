'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

const List = () => {
  const searchParams = useSearchParams() as URLSearchParams
  const params = new URLSearchParams(searchParams)

  return <div>{params.toString()}</div>
}

export default List
