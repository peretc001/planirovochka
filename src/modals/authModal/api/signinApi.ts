import { setToken } from '@/lib/cookie'
import serverApi from '@/lib/serverApi'

export const signinApi = async (values: { email: string; password: string }) => {
  try {
    const response = await serverApi.post('auth/signin.php', {
      email: values.email,
      password: values.password
    })

    if (!response?.status) {
      throw new Error(response?.error)
    }

    const token = response?.token ?? response?.data?.token

    if (token) {
      setToken(token)
    }

    return response?.status
  } catch (err) {
    console.log('signinApi', err)
  }
}
