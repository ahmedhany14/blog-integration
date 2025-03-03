import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
    transform(value: string) {
        if (!isValidObjectId(value)) {
            throw new BadRequestException('Invalid author_id: Must be a valid MongoDB ObjectId');
        }
        return value;
    }
}
