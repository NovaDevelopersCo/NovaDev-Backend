import { ApiProperty } from '@nestjs/swagger'

export class CreateTagDto {
    @ApiProperty({ example: 'Frontend', description: 'Значение тега' })
    title: string

    @ApiProperty({
        example: 'Frontend - тег всех фронтендеров',
        description: 'Описание тега',
    })
    description: string

    @ApiProperty({ example: '#8B0000', description: 'Цвет' })
    color: string
}
