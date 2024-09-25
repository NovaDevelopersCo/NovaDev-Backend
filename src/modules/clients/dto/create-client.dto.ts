import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
    Matches,
} from 'class-validator'
export class CreateClientDto {
    @ApiProperty({ example: 'Mars', description: 'Имя' })
    @IsNotEmpty({ message: 'Имя проекта обязательно' })
    @IsString({ message: 'Имя должно быть строкой' })
    @Length(2, 20, {
        message: 'Имя должно содержать от 3 до 20 символов',
    })
    name: string

    @ApiProperty({ example: '@igornezimin', description: 'Айди телеграма' })
    @Matches(/^@[A-Za-z0-9_]{3,32}$/, {
        message:
            'Telegram ID должен начинаться с "@" и содержать от 3 до 32 символов: буквы, цифры и нижнее подчеркивание',
    })
    tg: string

    @ApiProperty({ example: '+79261234567', description: 'Телефон' })
    @IsPhoneNumber('RU', { message: 'Номер телефона должен быть корректным' })
    @IsOptional()
    phone: string | null
}
