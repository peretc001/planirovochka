export interface IUser {
  id: number
  avatar: string | undefined
  email: string
  password?: string
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

export interface IGallery {
  id: number
  created_at: string
  description: string
  owner_id: number
  type: string
  url: string
}
