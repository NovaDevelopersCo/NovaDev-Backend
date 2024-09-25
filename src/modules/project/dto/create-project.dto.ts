import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator'
import { Client } from 'src/modules/clients/model/client.model'

export class CreateProjectDto {
    @IsNotEmpty({ message: 'Название проекта обязательно' })
    @IsString({ message: 'Название проекта должно быть строкой' })
    @ApiProperty({
        example: 'Пирамида',
        description: 'Название Проекта',
    })
    title: string

    @IsNotEmpty({ message: 'Технологии обязательны' })
    @ArrayNotEmpty({ message: 'Технологии обязательны' })
    @IsArray({ message: 'Технологии должны быть массивом' })
    @ApiProperty({
        example: ['NestJS', 'TypeORM'],
        description: 'Массив технологий которые используются в проекте',
    })
    @ApiProperty({
        example: 'NestJS',
        description: 'Массив технологий которые используются в проекте',
    })
    technologies: string[]

    @IsString({ message: 'Сервер должен быть строкой' })
    @ApiProperty({
        example: 'Пирамида СПБ',
        description: 'Сервер для проекта Пирамида в Санкт-Питербурге',
    })
    server: string

    @IsString({ message: 'Ссылка на доку должна быть строкой' })
    @ApiProperty({
        example: 'Https://Piramida?docs',
        description: 'Ссылка на документацию',
    })
    documentation: string

    @IsString({ message: 'Название проекта должно быть строкой' })
    @IsNotEmpty({ message: 'Дедлайн должен был заполнен обязательно' })
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
