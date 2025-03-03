import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { ConfigurationsModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    BlogModule,
    ConfigurationsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigurationsModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.databaseConfig.url
      })
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
