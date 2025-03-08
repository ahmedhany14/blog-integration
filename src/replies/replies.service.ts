import { Inject, Injectable } from '@nestjs/common';
import { RepliesRepositoryService } from './replies.repository.service';
import { CreateReplyDto } from './dto/create.reply.dto';

@Injectable()
export class RepliesService {

    constructor(
        @Inject()
        private readonly repliesRepositoryService: RepliesRepositoryService
    ) { }


    async addReply(createReplyDto: CreateReplyDto, reply_by: number, reply_to: number, comment_id: string) {
        return this.repliesRepositoryService.addReply(createReplyDto, reply_by, reply_to, comment_id);
    }

    async getReplies(comment_id: string) {
        return this.repliesRepositoryService.getReplies(comment_id);
    }
}
