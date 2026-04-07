import serverApi from '@/lib/serverApi'

export const addContactsApi = async (values: any) => {
  try {
    const response = await serverApi.post('account/contacts', { contacts: values })

    return response?.status
  } catch (err) {
    console.log('addContactsApi', err)
  }
}
