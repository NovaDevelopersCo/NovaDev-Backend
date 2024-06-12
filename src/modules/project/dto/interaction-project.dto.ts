import { ApiProperty } from '@nestjs/swagger'

export class InteractionProjectDto {
    @ApiProperty({ example: '1', description: 'Айди Проекта' })
    projectId: number

    @ApiProperty({ example: '1', description: 'Айди пользывателя' })
    userId: number
}
