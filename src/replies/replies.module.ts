import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { RepliesRepositoryService } from './replies.repository.service';

@Module({
  controllers: [RepliesController],
  providers: [RepliesService, RepliesRepositoryService]
})
export class RepliesModule {}
