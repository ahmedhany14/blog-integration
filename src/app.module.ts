import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { ConfigurationsModule } from './config/config.module';

@Module({
  imports: [
    BlogModule,
    ConfigurationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
