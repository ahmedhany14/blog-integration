import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
})
export class Blog extends Document {
    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
        minlength: 5,
        maxlength: 100,
    })
    title: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    content: string;

    @Prop({
        type: mongoose.Schema.Types.Number,
        default: 0
    })
    views: number;

    @Prop({
        type: mongoose.Schema.Types.Number,
        default: 0
    })
    upvotes: number;

    @Prop({
        type: mongoose.Schema.Types.Number,
        default: 0
    })
    downvotes: number;

    @Prop({
        type: mongoose.Schema.Types.Date,
        required: true,
        default: new Date(),

    })
    created_at: Date;

    @Prop({
        type: mongoose.Schema.Types.Date,
        required: true,
        default: new Date(),
    })
    updated_at: Date;

    @Prop({
        required: true,
        isInteger: true,
        MIN_VALUE: 0,
    })
    author_id: null;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);