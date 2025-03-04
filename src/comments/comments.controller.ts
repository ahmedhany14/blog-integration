import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';

@Controller('comments')
export class CommentsController {


    @Post()
    async addComment() { }

    @Get(':comment_id')
    async getComment() { }

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
