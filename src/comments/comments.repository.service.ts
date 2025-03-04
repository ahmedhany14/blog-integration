import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entity/comment.entity';
import { CreateCommentDto } from './dtos/create.comment.dto';

@Injectable()
export class CommentsRepositoryService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }


    async addComment(
        createCommnetDto: CreateCommentDto,
        blog_id: string,
        author_id: number
    ): Promise<CommentDocument> {
        try {
            const comment = new this.commentModel({
                ...createCommnetDto,
                blog_id,
                author_id
            });

            return comment.save();
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error while adding comment',
                details: "can't add comment, please try again"
            });
        }
    }

    async getComment(comment_id: string): Promise<CommentDocument> {
        try {
            return this.commentModel.findById(comment_id);
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error while fetching comment',
                details: "can't fetch comment, please try again"
            });
        }
    }
}
