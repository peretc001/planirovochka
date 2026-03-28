import React, { FC } from 'react'

import { IProfile } from '@/shared/interfaces'

import Card from '@/modules/profiles/components/card/card'

interface IProfilePage {
  readonly profile: IProfile
}

const Profile: FC<IProfilePage> = ({ profile }) => <Card card={profile} />

export default Profile
