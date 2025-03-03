import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dtos/create.blog.dto';
import { ObjectIdValidationPipe } from './validators/object.id.validation.pipe';
import { UpdateBlogDto } from './dtos/update.blog.dto';
import { BlogRedisCachingService } from '../redis/services/blog.redis.caching.service';
@Controller('blog')
export class BlogController {
    constructor(
        @Inject()
        private readonly blogService: BlogService,

        @Inject()
        private readonly blogRedisCachingService: BlogRedisCachingService

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
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
    ) {
        /*
            Cache the views of the blog
        */
        let blog;

        // NOTE: The second arg will be fixed after adding authentication
        if (await this.blogRedisCachingService.incViews(blog_id, 10))
            blog = await this.blogService.incrementViews(blog_id);
        else
            blog = await this.blogService.getOneBlog(blog_id);

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

    @Delete('delete-blog/:author_id/:blog_id')
    async deleteBlog(
        @Param('author_id', ParseIntPipe) author_id: number,
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
    ) {
        await this.blogService.deleteBlog(
            author_id,
            blog_id
        );

        await this.blogRedisCachingService.delAllBlogKeys(blog_id);

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
