import { Model } from 'sequelize-typescript'

interface ProfileAttrs {
    email: string
    image: string
    public_nickname: string
    birth_date: Date
    phone: string
    status: string
    social_links: {
        tg: string
        vk: string
        instagram: string
        github_nickname: string
    }
}

export class Profile extends Model<Profile, ProfileAttrs> {
    email: string
    image: string
    public_nickname: string
    birth_date: Date
    phone: string
    status: string
    social_links: {
        tg: string
        vk: string
        instagram: string
        github_nickname: string
    }
}

export const ProfileDefault: ProfileAttrs = {
    email: null,
    image: null,
    public_nickname: null,
    birth_date: null,
    phone: null,
    status: null,
    social_links: {
        tg: null,
        vk: null,
        instagram: null,
        github_nickname: null,
    },
}
