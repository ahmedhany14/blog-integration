
import * as Joi from 'joi';

export default Joi.object({
    // app configurations validation
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),

    // database configurations validation
    MONGO_URL: Joi.string().required(),

    // redis configurations validation
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PW: Joi.string().required(),
});