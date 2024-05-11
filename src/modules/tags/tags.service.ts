import { HttpStatus, Injectable, HttpException, Logger } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { InjectModel } from '@nestjs/sequelize'
import { Tags } from './model/tags.model'
import { UserTag } from './model/tagsUser.model'
import { UsersService } from '../users/users.service'
import { User } from '../users/model/users.model'

@Injectable()
export class TagsService {
    constructor(
        @InjectModel(Tags) private tagsRepository: typeof Tags,
        @InjectModel(UserTag) private userTagRepository: typeof UserTag,
        private readonly userService: UsersService
    ) {}

    async createTag(dto: CreateTagDto) {
        const tag = await this.tagsRepository.create(dto)
        return tag
    }

    async getAll() {
        const tags = await this.tagsRepository.findAll({
            include: { all: true },
        })
        return tags
    }

    async getTagByTitle(title: string) {
        const tag = await this.tagsRepository.findOne({ where: { title } })
        return tag
    }

    async getTagById(id: number) {
        const tag = await this.tagsRepository.findOne({ where: { id } })
        return tag
    }

    async deleteTag(id: number) {
        await this.tagsRepository.destroy({ where: { id } })
        return { status: HttpStatus.OK, message: 'Tag deleted' }
    }

    async CutTag(Tagid: number, userId: number) {
        const tag = await this.tagsRepository.findOne({ where: { id: Tagid } })
        if (!tag) {
            throw new HttpException('Tag not found', HttpStatus.NOT_FOUND)
        }

        const user = await User.findByPk(userId)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        const userTags = await user.$get('tags')
        const userHasTag = userTags.some((userTag: any) => userTag.id === Tagid)
        if (userHasTag) {
            await user.$remove('tag', tag)
            Logger.log(
                `Tag with ID ${Tagid} removed from user with ID ${userId}`
            )
            return { message: 'successful' }
        } else {
            Logger.log(
                `User with ID ${userId} does not have tag with ID ${Tagid}`
            )
            return { message: 'failed' }
        }
    }
    async GiveTag(Tagid: number, userId: number) {
        const tag = await this.tagsRepository.findOne({ where: { id: Tagid } })
        if (!tag) {
            throw new HttpException('Tag not found', HttpStatus.NOT_FOUND)
        }
        const user = await User.findByPk(userId)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        const userTags = await user.$get('tags')
        const userHasTag = userTags.some((userTag: any) => userTag.id === Tagid)
        if (!userHasTag) {
            await user.$add('tag', tag)
            return (
                Logger.log(
                    `Tag with ID ${Tagid} added to user with ID ${userId}`
                ),
                {
                    message: 'successful',
                }
            )
        } else {
            return (
                Logger.log(
                    `User with ID ${userId} already has tag with ID ${Tagid}`
                ),
                {
                    message: 'failed',
                }
            )
        }
    }

    async updateTag(id: number, dto) {
        const tag = await this.getTagById(id)
        if (!tag) {
            throw new HttpException('Tag not found', HttpStatus.NOT_FOUND)
        }
        tag.title = dto.title
        tag.description = dto.description
        await tag.save()
        return tag
    }
}
