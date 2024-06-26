interface InfoAttrs {
    email: string
    public_nickname: string
    full_name: string
    github: string
    payment_info: string
    tg: string
    phone: string
    image: string
}

export class Info implements InfoAttrs {
    email: string
    public_nickname: string
    full_name: string
    github: string
    payment_info: string
    tg: string
    phone: string
    image: string
}

export const InfoDefault: InfoAttrs = {
    email: null,
    public_nickname: null,
    full_name: null,
    github: null,
    payment_info: null,
    tg: null,
    phone: null,
    image: null,
}
