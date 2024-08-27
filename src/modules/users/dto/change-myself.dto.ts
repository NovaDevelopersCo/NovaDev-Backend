import {
    IsEmail,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Matches,
} from 'class-validator'

export class ChangeMyselfDateDto {
    @IsOptional()
    @IsEmail({}, { message: 'Неверный формат электронной почты' })
    readonly newEmail?: string

    @IsOptional()
    @IsString({ message: 'Никнейм должен быть строкой' })
    @Length(3, 20, { message: 'Никнейм должен содержать от 3 до 20 символов' })
    readonly public_nickname?: string

    @IsOptional()
    @IsString({ message: 'Полное имя должно быть строкой' })
    @Length(3, 50, {
        message: 'Полное имя должно содержать от 3 до 50 символов',
    })
    readonly full_name?: string

    @IsOptional()
    @IsUrl({}, { message: 'Неверный формат URL GitHub' })
    readonly github?: string

    @IsOptional()
    @IsString({ message: 'Информация о платеже должна быть строкой' })
    @Length(5, 100, {
        message: 'Информация о платеже должна содержать от 5 до 100 символов',
    })
    readonly payment_info?: string

    @IsOptional()
    @IsString({ message: 'Имя пользователя Telegram должно быть строкой' })
    @Matches(/^[a-zA-Z0-9_]{5,32}$/, {
        message: 'Неверный формат имени пользователя Telegram',
    })
    readonly tg?: string

    @IsOptional()
    @IsString({ message: 'Номер телефона должен быть строкой' })
    @Matches(/^\+?[1-9]\d{1,14}$/, {
        message: 'Неверный формат номера телефона',
    })
    readonly phone?: string
}
