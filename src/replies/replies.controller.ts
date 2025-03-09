import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

// services
import { RepliesService } from './replies.service';

// validators
import { ObjectIdValidationPipe } from 'src/blog/validators/object.id.validation.pipe';

// dto
import { CreateReplyDto } from './dto/create.reply.dto';
import { CommentsService } from 'src/comments/comments.service';
import { UpdateReplyDto } from './dto/update.reply.dto';
import { ReactisRedisCachingService } from '../redis/services/reactis.redis.caching.service';
import { types } from 'src/enums/react.to.types';


@Controller('replies')
export class RepliesController {

    constructor(
        @Inject()
        private readonly repliesService: RepliesService,

        @Inject()
        private readonly commentsService: CommentsService,

        @Inject()
        private readonly reactisRedisCachingService: ReactisRedisCachingService
    ) { }


    @Post(":comment_id/:reply_to")
    async addReply(
        @Body() createReplyDto: CreateReplyDto,
        @Param('comment_id', ObjectIdValidationPipe) comment_id: string,
        @Param('reply_to', ParseIntPipe) reply_to: number
    ) {

        const comment = await this.commentsService.getComment(comment_id);
        if (!comment) {
            throw new NotFoundException({
                message: "Comment Not Found",
            });
        }

        const reply_by = 1; // Get Author ID from Auth Service or JWT Token in Real World or your application

        const reply = await this.repliesService.addReply(createReplyDto, reply_by, reply_to, comment_id);


        return {
            response: {
                message: "Reply Added Successfully",
                data: reply
            }
        }
    }

    @Get(':comment_id')
    async getCommentReplies(
        @Param('comment_id', ObjectIdValidationPipe) comment_id: string
    ) {

        const replies = await this.repliesService.getReplies(comment_id);

        return {
            response: {
                message: "Replies Fetched Successfully",
                data: replies
            }
        }
    }

    @Patch(':reply_id')
    async updateReply(
        @Param('reply_id', ObjectIdValidationPipe) reply_id: string,
        @Body() updateReplyDto: UpdateReplyDto
    ) {

        const reply_by = 2; // Get Author ID from Auth Service or JWT Token in Real World or your application

        const reply = await this.repliesService.updateReply(
            reply_id,
            reply_by,
            updateReplyDto
        );


        return {
            response: {
                message: "Reply Updated Successfully",
                data: reply
            }
        }
    }

    @Delete(':reply_id')
    async deleteReply(
        @Param('reply_id', ObjectIdValidationPipe) reply_id: string
    ) {

        const reply_by = 2; // Get Author ID from Auth Service or JWT Token in Real World or your application

        await this.repliesService.deleteReply(
            reply_id,
            reply_by
        );

        return {
            response: {
                message: "Reply Deleted Successfully",
                data: {}
            }
        }
    }


    @Patch('like/:reply_id')
    async likeReply(
        @Param('reply_id', ObjectIdValidationPipe) reply_id: string
    ) {
        const reply = await this.repliesService.getReply(reply_id);
        if (!reply) {
            throw new NotFoundException({
                message: "Reply Not Found",
            });
        }

        const liker_id = 1; // Get Liker ID from Auth Service or JWT Token in Real World or your application

        const redis_ret = await this.reactisRedisCachingService.setLikeTo(types.REPLY, reply_id, liker_id);

        await this.repliesService.likeReply(reply_id, redis_ret.like);
        await this.repliesService.dislikeReply(reply_id, redis_ret.dislike);

        return {
            response: {
                message: "Reply Liked Successfully",
                like: redis_ret.like === 1 ? 'Reply Liked' : 'Reply Like Removed',
                dislike: redis_ret.dislike === 1 ? 'Reply Disliked' : 'Reply Dislike Removed'
            }
        }
    }


    @Patch('dislike/:reply_id')
    async dislikeReply(
        @Param('reply_id', ObjectIdValidationPipe) reply_id: string
    ) {
        const reply = await this.repliesService.getReply(reply_id);
        if (!reply) {
            throw new NotFoundException({
                message: "Reply Not Found",
            });
        }

        const disliker_id = 1; // Get Disliker ID from Auth Service or JWT Token in Real World or your application

        const redis_ret = await this.reactisRedisCachingService.setDislike(types.REPLY, reply_id, disliker_id);

        await this.repliesService.likeReply(reply_id, redis_ret.like);
        await this.repliesService.dislikeReply(reply_id, redis_ret.dislike);


        return {
            response: {
                message: "Reply Disliked Successfully",
                like: redis_ret.like === 1 ? 'Reply Liked' : 'Reply Like Removed',
                dislike: redis_ret.dislike === 1 ? 'Reply Disliked' : 'Reply Dislike Removed'
            }
        }
    }
}
