export interface IUser {
  id: number
  avatar?: string | undefined
  email: string
  name: string
}

export interface IProfile {
  id: number
  styles: string[]
  avatar: string
  city: string
  city_code: string
  created_at: string
  description: string
  experience: string
  name: string
  owner_id: number
  segments: string[]
  status: string
  telegram: string
  types: string[]
}
