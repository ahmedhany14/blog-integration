import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, Blog } from './entity/blog.entity';
import { CreateBlogDto } from './dtos/create.blog.dto';
@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    ) { }


    async createBlog(createBlogDto: CreateBlogDto, author_id: number) {
        const blog = new this.blogModel({
            ...createBlogDto,
            author_id: author_id
        });
        return await blog.save();
    }

    async getOneBlog(id: string) {
        try {
            return await this.blogModel.findById(id);
        } catch (err) {
            throw new InternalServerErrorException('Error fetching blog');
        }
    }

    async updateBlog(id: string) {
    }

    async deleteBlog(id: string) {
    }

    async upvoteBlog(id: string) {
    }

    async downvoteBlog(id: string) {
    }

    async getBlogs(author_id: number) {
    }
}
