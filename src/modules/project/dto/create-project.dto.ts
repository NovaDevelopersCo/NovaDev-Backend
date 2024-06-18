import { ApiProperty } from '@nestjs/swagger'
import { Client } from 'src/modules/clients/model/client.model'

export class CreateProjectDto {
    @ApiProperty({
        example: 'Пирамида',
        description: 'Название Проекта',
    })
    title: string

    @ApiProperty({
        example: 'NestJS',
        description: 'Массив технологий которые используются в проекте',
    })
    technologies: string[]

    @ApiProperty({
        example: 'Пирамида СПБ',
        description: 'Сервер для проекта Пирамида в Санкт-Питербурге',
    })
    server: string

    @ApiProperty({
        example: 'Https://Piramida?docs',
        description: 'Ссылка на документацию',
    })
    documentation: string

    @ApiProperty({
        example: '10.03.2006',
        description: 'Дедлайн проекта',
    })
    deadline: Date

    @ApiProperty({
        example: 'Марс',
        description: 'Заказчик проекта',
    })
    client: Client
}
