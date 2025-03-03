import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dtos/create.blog.dto';
import { ObjectIdValidationPipe } from './validators/object.id.validation.pipe';
import { UpdateBlogDto } from './dtos/update.blog.dto';
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

    @Get('get-one-blog/:blog_id')
    async getOneBlog(
        @Param('blog_id', ObjectIdValidationPipe) id: string,
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

    @Patch('update-blog/:author_id/:blog_id')
    async updateBlog(
        @Param('author_id', ParseIntPipe) author_id: number,
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
        @Body() updateBlogDto: UpdateBlogDto,
    ) { 
        const blog = await this.blogService.updateBlog(updateBlogDto, blog_id, author_id);

        return { message: 'Blog updated', blog };
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
