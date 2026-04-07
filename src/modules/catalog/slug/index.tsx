import React, { FC } from 'react'

import { IProfile } from '@/shared/interfaces'

import Card from '@/modules/catalog/slug/components/card/card'

interface IProfilePage {
  readonly profile: IProfile
}

const Profile: FC<IProfilePage> = ({ profile }) => <Card card={profile} />

export default Profile
