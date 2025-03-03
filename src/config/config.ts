import { Config } from './config.interface';

export default (): Config => ({
    app: {
        port: parseInt(process.env.PORT, 10) || 3000,
        env: process.env.NODE_ENV || 'development',
    },
    database: {
        url: process.env.MONGO_URL,
    }
});