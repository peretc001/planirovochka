import React, { FC } from 'react'

import Login from '@/layout/header/login/login'
import User from '@/layout/header/user/user'

interface IAuth {
  readonly isAuth: boolean
}

const Auth: FC<IAuth> = ({ isAuth }) => (isAuth ? <User /> : <Login />)

export default Auth
