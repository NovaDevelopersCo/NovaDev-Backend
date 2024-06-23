import { ApiProperty } from '@nestjs/swagger'

export class InteractionTeamDto {
    @ApiProperty({ example: '1', description: 'Айди Команды' })
    teamId: number

    @ApiProperty({ example: '1', description: 'Айди пользывателя' })
    userId: number
}
