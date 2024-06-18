import { ApiProperty } from '@nestjs/swagger'

export class ChangeTeamDateDto {
    @ApiProperty({
        example: 'bynary-team',
        description: 'Новое название команды',
    })
    readonly newTitle?: string
    @ApiProperty({
        example: 'Основная команда Bynary.co',
        description: 'Новое описание команды',
    })
    readonly newDescription?: string
}
