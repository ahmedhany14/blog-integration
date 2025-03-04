import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create.comment.dto';
import { response } from 'express';
import { ObjectIdValidationPipe } from 'src/blog/validators/object.id.validation.pipe';
import { UpdateCommentDto } from './dtos/update.comment.dto';
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
    async deleteComment(
        @Param('comment_id', ObjectIdValidationPipe) comment_id: string
    ) {
        const deleter_id = 1; // Get Deleter ID from Auth Service or JWT Token in Real World or your application
        await this.commentsService.deleteComment(comment_id, deleter_id);
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
