import { ApiProperty } from '@nestjs/swagger'

export class InteractionClientDto {
    @ApiProperty({ example: '1', description: 'Айди Проекта' })
    projectId: number

    @ApiProperty({ example: '1', description: 'Айди клиента' })
    clientId: number
}
