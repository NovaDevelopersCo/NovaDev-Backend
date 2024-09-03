import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { IsNotWhitespace } from 'src/pipes/spaces-validation.pipe'

export class TeamDto {
    @IsNotWhitespace({
        message:
            'Название команды не может быть пустым или состоять только из пробелов.',
    })
    @IsNotEmpty({ message: 'Название команды обязательно' })
    @Length(3, 20, {
        message: 'Название команды должно содержать от 3 до 20 символов',
    })
    @ApiProperty({ example: 'Крутая команда', description: 'Название команды' })
    title: string

    @IsNotWhitespace({
        message:
            'Название команды не может быть пустым или состоять только из пробелов.',
    })
    @Length(3, 150, {
        message: 'Описание команды должно содержать от 3 до 150 символов',
    })
    @IsNotEmpty({ message: 'Описание команды обязательно' })
    @ApiProperty({ example: 'Крутая команда', description: 'Описание команды' })
    description: string
}
