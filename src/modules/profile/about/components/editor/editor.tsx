'use client'

import React, { FC } from 'react'

interface IEditor {
  readonly content: React.ReactNode
  readonly defaultContent: React.ReactNode
  readonly onChange: (value: React.ReactNode) => void
}

const Editor: FC<IEditor> = ({ content, defaultContent, onChange }) =>
  123
  // <SimpleEditor content={content} defaultContent={defaultContent} onChange={onChange} />

export default Editor
