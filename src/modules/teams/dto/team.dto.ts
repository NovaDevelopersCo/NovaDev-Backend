import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class TeamDto {
    @ApiProperty({ example: 'Крутая команда', description: 'Название команды' })
    readonly title?: string

    @ApiProperty({ example: 'Крутая команда', description: 'Описание команды' })
    readonly description?: string
}
