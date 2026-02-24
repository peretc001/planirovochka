'use client'

import React, { FC } from 'react'

import SimpleEditor from '@/components/tiptap-templates/simple/simple-editor'

interface IEditor {
  readonly defaultContent: React.ReactNode
  readonly onChange: (value: React.ReactNode) => void
}

const Editor: FC<IEditor> = ({ defaultContent, onChange }) => (
  <SimpleEditor defaultContent={defaultContent} onChange={onChange} />
)

export default Editor
