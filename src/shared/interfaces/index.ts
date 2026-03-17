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
  gallery: IGallery[]
  name: string
  owner_id: number
  prices: IPrices
  segments: string[]
  status: string
  telegram: string
  types: ITypes[]
}

export interface IGallery {
  id: number
  created_at: string
  description: string
  owner_id: number
  type: string
  url: string
}

export interface ITypes {
  label: string
  value: string
}

export interface IPrices {
  author_max: string | undefined
  author_min: string | undefined
  full_max: string | undefined
  full_min: string | undefined
  furniture_max: string | undefined
  furniture_min: string | undefined
  measurement_max: string | undefined
  measurement_min: string | undefined
  plane_max: string | undefined
  plane_min: string | undefined
  visual_max: string | undefined
  visual_min: string
}
