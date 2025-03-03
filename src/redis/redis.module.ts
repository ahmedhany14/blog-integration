import { Module } from '@nestjs/common';
import Redis from 'ioredis';

import { ConfigurationsModule } from './../config/config.module';
import { ConfigService } from 'src/config/config.service';

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
    ],

    exports: ['REDIS_CLIENT'],

})
export class RedisModule { }