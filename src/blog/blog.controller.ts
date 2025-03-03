import { Controller, Param, Post } from '@nestjs/common';

@Controller('blog')
export class BlogController {
    constructor() { }

    @Post('create-blog')
    async createBlog() {
        return { message: 'Blog created' };
    }

    @Post('get-blogs/:author_id')
    async getBlogs(
        @Param('author_id') author_id: string,
    ) {
        return { message: 'Blogs fetched' };
    }

    @Post('update-blog/:blog_id')
    async updateBlog(
        @Param('blog_id') id: string,
    ) {
        return { message: 'Blog updated' };
    }

    @Post('delete-blog/:blog_id')
    async deleteBlog(
        @Param('blog_id') id: string,
    ) {
        return { message: 'Blog deleted' };
    }

    @Post('upvote-blog/:blog_id')
    async upvoteBlog(
        @Param('blog_id') id: string,
    ) {
        return { message: 'Blog upvoted' };
    }

    @Post('downvote-blog/:blog_id')
    async downvoteBlog(
        @Param('blog_id') id: string,
    ) {
        return { message: 'Blog downvoted' };
    }
}
