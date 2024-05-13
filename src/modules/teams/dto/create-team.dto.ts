import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateTeamDto {
    @ApiProperty({ example: 'Крутая команда', description: 'Название команды' })
    @IsString({ message: 'Должно быть строкой' })
    readonly title: string

    @ApiProperty({ example: 'Крутая команда', description: 'Описание команды' })
    @IsString({ message: 'Должно быть строкой' })
    readonly description: string
}
