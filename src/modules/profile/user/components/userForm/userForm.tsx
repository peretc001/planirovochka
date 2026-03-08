import React, { FC } from 'react'
import { Form, Input, message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import FileUpload from '@/shared/components/fileUpload/fileUpload'
import { IUser } from '@/shared/interfaces'

import { addAvatarApi } from '@/modules/profile/user/api/addAvatarApi'
import { deleteAvatarApi } from '@/modules/profile/user/api/deleteAvatarApi'

import styles from './userForm.module.scss'

interface IUserForm {
  readonly user: IUser
}

const UserForm: FC<IUserForm> = ({ user }) => {
  const t = useTranslations('profile')
  const t1 = useTranslations('auth')

  const queryClient = useQueryClient()

  const [form] = Form.useForm()

  const { isLoading: isUploadLoading, mutate: uploadFile } = useMutation({
    mutationFn: (file: File) => addAvatarApi(file),
    onError: () => message.error(t('info.error')),
    onSuccess: url => {
      if (url) {
        form.setFieldValue('avatar', url)
        queryClient.invalidateQueries({ queryKey: ['user'] })
      }
    }
  })

  const { mutate: deleteFile } = useMutation({
    mutationFn: () => deleteAvatarApi(),
    onError: () => message.error(t('info.error')),
    onSuccess: status => {
      if (status) {
        form.resetFields(['avatar'])
        queryClient.invalidateQueries({ queryKey: ['user'] })
      }
    }
  })

  return (
    <Form className={styles.root} form={form} initialValues={user} layout="vertical" name="user">
      <div className={styles.avatar}>
        <FileUpload
          isLoading={isUploadLoading}
          file={user?.avatar}
          onDelete={deleteFile}
          onUpload={uploadFile}
        />
        <p>{t('info.avatar')}</p>
      </div>

      <Form.Item label={t1('email.label')} name="email">
        <Input disabled placeholder={t1('email.placeholder')} />
      </Form.Item>
    </Form>
  )
}

export default UserForm
