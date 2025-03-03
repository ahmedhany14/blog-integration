import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, Blog } from './entity/blog.entity';
import { CreateBlogDto } from './dtos/create.blog.dto';
import { UpdateBlogDto } from './dtos/update.blog.dto';

@Injectable()
export class BlogRepositoryService {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }

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


    async updateBlog(blog: Blog, updateBlogDto: UpdateBlogDto) {
        try {
            return await this.blogModel.findByIdAndUpdate(blog._id, updateBlogDto, { new: true });
        } catch (err) {
            throw new InternalServerErrorException('Error updating blog');
        }
    }

    async deleteBlog(blog: Blog) {
        try {
            await this.blogModel.findByIdAndDelete(blog._id);
        } catch (err) {
            throw new InternalServerErrorException('Error deleting blog');
        }

    }
}
