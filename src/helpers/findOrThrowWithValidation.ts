import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { Repository } from 'sequelize-typescript'
import { Attributes, FindOptions, Model, WhereOptions } from 'sequelize'

export async function findOrThrowWithValidation<T extends Model>(
    repository: Repository<T>,
    id: number,
    options: Omit<FindOptions<T>, 'where'>,
    entityName: string = 'Entity'
): Promise<T> {
    if (id > 2147483647) {
        throw new BadRequestException('Invalid ID.')
    }
    if (id > Number.MAX_SAFE_INTEGER) {
        throw new BadRequestException('Invalid ID.')
    }
    const where: WhereOptions<Attributes<T>> = {
        id: id as unknown as Attributes<T>[keyof Attributes<T>],
    }
    const entity = await repository.findOne({
        where,
        ...options,
    })
    if (!entity) {
        throw new HttpException(`${entityName} not found`, HttpStatus.NOT_FOUND)
    }

    return entity
}
