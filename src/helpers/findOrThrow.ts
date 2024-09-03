import { HttpException, HttpStatus } from '@nestjs/common'
import { Repository } from 'sequelize-typescript'
import { FindOptions, WhereOptions } from 'sequelize'
import { Model } from 'sequelize-typescript'

export async function findOrThrow<T extends Model>(
    repository: Repository<T>,
    fieldValue: string | number,
    fieldName: string,
    options: Omit<FindOptions<T>, 'where'> = {},
    entityName: string = 'Entity'
): Promise<T> {
    const where: WhereOptions = { [fieldName]: fieldValue }

    const entity = await repository.findOne({
        where,
        ...options,
    })

    if (!entity) {
        throw new HttpException(`${entityName} not found`, HttpStatus.NOT_FOUND)
    }

    return entity
}

export async function findOrThrowName<T extends Model>(
    repository: Repository<T>,
    options: Omit<FindOptions<T>, 'where'> & { where: WhereOptions },
    entityName: string = 'Entity'
): Promise<T> {
    const entity = await repository.findOne(options)

    if (!entity) {
        throw new HttpException(`${entityName} not found`, HttpStatus.NOT_FOUND)
    }

    return entity
}
