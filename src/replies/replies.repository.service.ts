import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Replies, RepliesDocument } from './entity/replies.entity';
import { Model } from 'mongoose';
import { CreateReplyDto } from './dto/create.reply.dto';

@Injectable()
export class RepliesRepositoryService {

    constructor(
        @InjectModel(Replies.name)
        private readonly repliesModel: Model<RepliesDocument>
    ) { }


    async addReply(createReplyDto: CreateReplyDto, reply_by: number, reply_to: number, comment_id: string) {
        try {
            const reply = new this.repliesModel({
                ...createReplyDto,
                reply_by,
                reply_to,
                comment_id
            });
            return await reply.save();
        }
        catch (err) {
            throw new InternalServerErrorException({
                message: 'Error adding reply',
                details: err.message
            })
        }
    }
}
