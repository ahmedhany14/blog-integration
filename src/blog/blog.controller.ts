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

    @Get('get-blogs/:author_id')
    async getBlogs(
        @Param('author_id', ParseIntPipe) author_id: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        const blogs = await this.blogService.getBlogs(author_id, page);
        return { message: 'Blogs fetched', blogs };
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

    @Post('upvote-blog/:blog_id/:upvoter_id')
    async upvoteBlog(
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
        @Param('upvoter_id', ParseIntPipe) upvoter_id: number
    ) {
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

    @Post('downvote-blog/:blog_id/:downvoter_id')
    async downvoteBlog(
        @Param('blog_id') blog_id: string,
        @Param('downvoter_id', ParseIntPipe) downvoter_id: number
    ) {
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
