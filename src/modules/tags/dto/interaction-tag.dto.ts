import { ApiProperty } from '@nestjs/swagger'

export class InteractionTagDto {
    @ApiProperty({ example: '1', description: 'Айди тега' })
    Tagid: number

    @ApiProperty({ example: '1', description: 'Айди пользывателя' })
    userId: number
}
