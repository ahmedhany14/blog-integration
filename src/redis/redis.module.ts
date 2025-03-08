import { Module } from '@nestjs/common';
import Redis from 'ioredis';

import { ConfigurationsModule } from './../config/config.module';
import { ConfigService } from 'src/config/config.service';
import { BlogRedisCachingService } from './services/blog.redis.caching.service';
import { ReactisRedisCachingService } from './services/reactis.redis.caching.service';

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
        ReactisRedisCachingService,
    ],

    exports: [BlogRedisCachingService, ReactisRedisCachingService],

})
export class RedisModule { }