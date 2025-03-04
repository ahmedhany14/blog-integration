import { Module } from '@nestjs/common';
import Redis from 'ioredis';

import { ConfigurationsModule } from './../config/config.module';
import { ConfigService } from 'src/config/config.service';
import { BlogRedisCachingService } from './services/blog.redis.caching.service';
import { CommentRedisServiceService } from './services/commnet.redis.service.service';

@Module({
    imports: [ConfigurationsModule],
    providers: [
        {

            provide: 'REDIS_CLIENT',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new Redis({
                    host: configService.redisConfig.host,
                    port: configService.redisConfig.port,
                    password: configService.redisConfig.password,
                });
            },
        },
        BlogRedisCachingService,
        CommentRedisServiceService,
    ],

    exports: [BlogRedisCachingService],

})
export class RedisModule { }