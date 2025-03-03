import { Body, Controller, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dtos/create.blog.dto';
import { ObjectIdValidationPipe } from './validators/object.id.validation.pipe';
@Controller('blog')
export class BlogController {
    constructor(
        @Inject()
        private readonly blogService: BlogService,

    ) { }

    @Post('create-blog/:author_id')
    async createBlog(
        @Param('author_id', ParseIntPipe) author_id: number,
        @Body() createBlogDto: CreateBlogDto,
    ) {
        const blog = await this.blogService.createBlog(createBlogDto, author_id);
        return { message: 'Blog created', blog };
    }

    @Post('get-one-blog/:blog_id')
    async getOneBlog(
        @Param('blog_id',) id: string,
    ) {
        const blog = await this.blogService.getOneBlog(id);
        return { message: 'Blog fetched', blog };
    }

    @Post('get-blogs/:author_id')
    async getBlogs(
        @Param('author_id', ParseIntPipe) author_id: number,
    ) {
        const blogs = await this.blogService.getBlogs(author_id);
        return { message: 'Blogs fetched' };
    }

    @Post('update-blog/:blog_id')
    async updateBlog(
        @Param('blog_id') id: string,
    ) {
        const blog = await this.blogService.updateBlog(id);

        return { message: 'Blog updated' };
    }

    @Post('delete-blog/:blog_id')
    async deleteBlog(
        @Param('blog_id') id: string,
    ) {
        const blog = await this.blogService.deleteBlog(id);

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
