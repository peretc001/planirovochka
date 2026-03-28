import { DESIGN_TYPES } from '@/constants'

export interface IUser {
  id: string | undefined
  avatar: string | undefined
  email: string | undefined
  password: string | undefined
}

export interface IProfile {
  id: number
  styles: string[]
  stylesLabel: IType[]
  avatar: string
  city: string
  city_code: string
  created_at: string
  description: string
  experience: string
  experienceLabel: string
  gallery: IGallery[]
  name: string
  owner_id: number
  prices: IPrices
  segments: string[]
  status: string
  statusLabel: string
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

export interface IType {
  label: string
  unit: string
  value: string
}

export interface IOption {
  label: string
  value: string
}

type DesignTypeValue = (typeof DESIGN_TYPES)[number]['value']

type PriceSuffix = 'max' | 'min'

export type IPrices = {
  [K in DesignTypeValue as `${K}_${PriceSuffix}`]?: string | undefined
}
