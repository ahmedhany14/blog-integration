import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config } from './config.interface';

@Injectable()
export class ConfigService {
    constructor(private readonly configService: NestConfigService) { }

    get appConfig(): Config['app'] {
        return this.configService.get<Config['app']>('app');
    }

    get databaseConfig(): Config['database'] {
        return this.configService.get<Config['database']>('database');
    }
}