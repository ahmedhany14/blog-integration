import { Config } from './config.interface';

export default (): Config => ({
    app: {
        port: parseInt(process.env.PORT, 10) || 3000,
        env: process.env.NODE_ENV || 'development',
    },
    database: {
        url: process.env.MONGO_URL,
    },

    redis: {
        port: parseInt(process.env.REDIS_PORT, 10),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PW,
    },
});