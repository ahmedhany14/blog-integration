import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
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

    @Post('create-blog')
    async createBlog(
        @Body() createBlogDto: CreateBlogDto,
    ) {
        const author_id = 1; // Get Author ID from Auth Service or JWT Token in Real World or your application

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
        const viewer_id = 1; // Get Viewer ID from Auth Service or JWT Token in Real World or your application

        // NOTE: The second arg will be fixed after adding authentication
        if (await this.blogRedisCachingService.incViews(blog_id, viewer_id))
            blog = await this.blogService.incrementViews(blog_id);
        else
            blog = await this.blogService.getOneBlog(blog_id);

        return { message: 'Blog fetched', blog };
    }

    @Get('get-blogs/:author_id')
    async getBlogs(
        @Param('author_id', ParseIntPipe) author_id: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        const blogs = await this.blogService.getBlogs(author_id, page);
        return { message: 'Blogs fetched', blogs };
    }

    @Patch('update-blog/:blog_id')
    async updateBlog(
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        const author_id = 10; // Get Author ID from Auth Service or JWT Token in Real World or your application

        const blog = await this.blogService.updateBlog(updateBlogDto, blog_id, author_id);

        return { message: 'Blog updated', blog };
    }

    @Delete('delete-blog/:blog_id')
    async deleteBlog(
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
    ) {
        const author_id = 1; // Get Author ID from Auth Service or JWT Token in Real World or your application

        await this.blogService.deleteBlog(
            author_id,
            blog_id
        );

        await this.blogRedisCachingService.delAllBlogKeys(blog_id);

        return { message: 'Blog deleted' };
    }

    @Post('upvote-blog/:blog_id')
    async upvoteBlog(
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
    ) {
        const upvoter_id = 1; // Get Upvoter ID from Auth Service or JWT Token in Real World or your application

        const blog = await this.blogService.getOneBlog(blog_id);

        if (!blog) throw new NotFoundException('Blog not found');

        const ret = await this.blogRedisCachingService.setUpVote(blog_id, upvoter_id);

        await this.blogService.upvoteBlog(blog_id, ret.upvote);
        await this.blogService.downvoteBlog(blog_id, ret.downvote);

        return {
            message: {
                upvote: ret.upvote === 1 ? 'Blog upvoted' : 'Blog upvote removed',
                downvote: ret.downvote === 1 ? 'Blog downvoted' : 'Blog downvote removed'
            }
        };
    }

    @Post('downvote-blog/:blog_id')
    async downvoteBlog(
        @Param('blog_id') blog_id: string,
    ) {
        const downvoter_id = 1; // Get Downvoter ID from Auth Service or JWT Token in Real World or your application

        const blog = await this.blogService.getOneBlog(blog_id);
        if (!blog) throw new NotFoundException('Blog not found');

        const ret = await this.blogRedisCachingService.setDownVote(blog_id, downvoter_id); // 1 ? will increase the downvote count : -1 ? will decrease the downvote count

        await this.blogService.upvoteBlog(blog_id, ret.upvote);
        await this.blogService.downvoteBlog(blog_id, ret.downvote);


        return {
            message: {
                upvote: ret.upvote === 1 ? 'Blog upvoted' : 'Blog upvote removed',
                downvote: ret.downvote === 1 ? 'Blog downvoted' : 'Blog downvote removed'
            }
        };
    }
}
