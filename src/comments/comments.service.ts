import { Inject, Injectable, NotFoundException } from '@nestjs/common';

// Dtos
import { CreateCommentDto } from './dtos/create.comment.dto';

// Service
import { BlogService } from 'src/blog/blog.service';
import { CommentsRepositoryService } from './comments.repository.service';

@Injectable()
export class CommentsService {
    constructor(
        @Inject()
        private readonly commentsRepositoryService: CommentsRepositoryService,
        @Inject()
        private readonly blogService: BlogService
    ) { }

    async addComment(
        createCommnetDto: CreateCommentDto,
        blog_id: string,
        author_id: number
    ) {
        const blog = await this.blogService.getOneBlog(blog_id);
        if (!blog) throw new NotFoundException('Blog not found');

        return await this.commentsRepositoryService.addComment(createCommnetDto, blog_id, author_id);
    }

    async getComment(comment_id: string) {
        return await this.commentsRepositoryService.getComment(comment_id);
    }
}
