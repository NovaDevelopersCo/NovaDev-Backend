interface AuthAttrs {
    private_nickname: string
    password: string
}

export class Auth implements AuthAttrs {
    private_nickname: string
    password: string
}

export const AuthDefault: AuthAttrs = {
    private_nickname: null,
    password: null,
}
