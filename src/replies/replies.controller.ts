import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

// services
import { RepliesService } from './replies.service';

// validators
import { ObjectIdValidationPipe } from 'src/blog/validators/object.id.validation.pipe';

// dto
import { CreateReplyDto } from './dto/create.reply.dto';
import { CommentsService } from 'src/comments/comments.service';

@Controller('replies')
export class RepliesController {

    constructor(
        @Inject()
        private readonly repliesService: RepliesService,

        @Inject()
        private readonly commentsService: CommentsService
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
    async updateReply() {
        // Update Reply Logic Here

        return {
            response: {
                message: "Reply Updated Successfully",
                data: {}
            }
        }
    }

    @Delete(':reply_id')
    async deleteReply() {
        // Delete Reply Logic Here

        return {
            response: {
                message: "Reply Deleted Successfully",
                data: {}
            }
        }
    }


    @Patch('like/:reply_id')
    async likeReply() {
        // Like Reply Logic Here

        return {
            response: {
                message: "Reply Liked Successfully",
                data: {}
            }
        }
    }


    @Patch('dislike/:reply_id')
    async dislikeReply() {
        // Dislike Reply Logic Here

        return {
            response: {
                message: "Reply Disliked Successfully",
                data: {}
            }
        }
    }
}
