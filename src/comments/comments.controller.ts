import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Patch, Post, Put, Query } from '@nestjs/common';

// dtos
import { CreateCommentDto } from './dtos/create.comment.dto';
import { UpdateCommentDto } from './dtos/update.comment.dto';

// validators
import { ObjectIdValidationPipe } from 'src/blog/validators/object.id.validation.pipe';

// services
import { CommentsService } from './comments.service';
import { CommentRedisServiceService } from 'src/redis/services/commnet.redis.service.service';

@Controller('comments')
export class CommentsController {

    constructor(
        @Inject()
        private readonly commentsService: CommentsService,
        @Inject()
        private readonly commentRedisCachingService: CommentRedisServiceService

    ) { }

    @Post(":blog_id")
    async addComment(
        @Body() createCommnetDto: CreateCommentDto,
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string
    ) {
        const author_id = 1; // Get Author ID from Auth Service or JWT Token in Real World or your application

        const comment = await this.commentsService.addComment(createCommnetDto, blog_id, author_id);

        return {
            response: {
                message: "Comment Added Successfully",
                data: comment
            }
        }
    }

    @Get(':comment_id')
    async getComment(
        @Param('comment_id', ObjectIdValidationPipe) comment_id: string
    ) {
        const comment = await this.commentsService.getComment(comment_id);
        return {
            response: {
                message: "Comment Fetched Successfully",
                data: comment
            }
        }

    }

    @Delete(':comment_id')
    async deleteComment(
        @Param('comment_id', ObjectIdValidationPipe) comment_id: string
    ) {
        const deleter_id = 1; // Get Deleter ID from Auth Service or JWT Token in Real World or your application

        await this.commentsService.deleteComment(comment_id, deleter_id);
        await this.commentRedisCachingService.delAllCommnetKeys(comment_id);

        return {
            response: {
                message: "Comment Deleted Successfully",
            }
        }
    }

    @Put(':comment_id')
    async editComment(
        @Param('comment_id', ObjectIdValidationPipe) comment_id: string,
        @Body() updateCommentDto: UpdateCommentDto
    ) {
        const author_id = 1; // Get Author ID from Auth Service or JWT Token in Real World or your application
        const comment = await this.commentsService.updateComment(comment_id, updateCommentDto, author_id);
        return {
            response: {
                message: "Comment Edited Successfully",
                data: comment
            }
        }

    }

    @Get('blog_comments/:blog_id')
    async getBlogComments(
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
        @Query('page') page: number = 1
    ) {
        const response = await this.commentsService.getBlogComments(blog_id, page);

        return response;
    }

    @Patch('like/:comment_id')
    async likeComment(
        @Param('comment_id', ObjectIdValidationPipe) comment_id: string
    ) {
        const comment = await this.commentsService.getComment(comment_id);
        if (!comment) throw new NotFoundException('Comment not found');

        const liker_id = 1; // Get Liker ID from Auth Service or JWT Token in Real World or your application
        const redis_ret = await this.commentRedisCachingService.setLikeToComment(comment_id, liker_id);


        await this.commentsService.likeComment(comment_id, redis_ret.like);
        await this.commentsService.dislikeComment(comment_id, redis_ret.dislike);

        return {
            response: {
                like: redis_ret.like === 1 ? 'Comment Liked' : 'Comment Like Removed',
                dislike: redis_ret.dislike === 1 ? 'Comment Disliked' : 'Comment Dislike Removed'
            }
        }

    }

    @Patch('dislike/:comment_id')
    async dislikeComment(
        @Param('comment_id', ObjectIdValidationPipe) comment_id: string
    ) {
        const comment = await this.commentsService.getComment(comment_id);
        if (!comment) throw new NotFoundException('Comment not found');

        const disliker_id = 1; // Get Disliker ID from Auth Service or JWT Token in Real World or your application
        const redis_ret = await this.commentRedisCachingService.setDislikeToComment(comment_id, disliker_id);

        await this.commentsService.likeComment(comment_id, redis_ret.like);
        await this.commentsService.dislikeComment(comment_id, redis_ret.dislike);

        return {
            response: {
                like: redis_ret.like === 1 ? 'Comment Liked' : 'Comment Like Removed',
                dislike: redis_ret.dislike === 1 ? 'Comment Disliked' : 'Comment Dislike Removed'
            }
        }
    }

    @Get(':comment_id/replies')
    async getReplies() {
        /*
            Not Planned Yet
        */
        return "Not Planned Yet"
    }

    @Post(':comment_id/replies')
    async addReply() {
        /*
            Not Planned Yet
        */
        return "Not Planned Yet"
    }
}
