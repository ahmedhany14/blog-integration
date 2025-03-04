import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create.comment.dto';
import { response } from 'express';
import { ObjectIdValidationPipe } from 'src/blog/validators/object.id.validation.pipe';
@Controller('comments')
export class CommentsController {

    constructor(
        @Inject()
        private readonly commentsService: CommentsService
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
    async deleteComment() { }

    @Put(':comment_id')
    async editComment() { }

    @Get('blog_comments/:blog_id')
    async getBlogComments() { }

    @Patch(':comment_id/like')
    async likeComment() { }

    @Patch(':comment_id/dislike')
    async dislikeComment() { }

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
