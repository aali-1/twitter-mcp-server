import dotenv from 'dotenv';
import Joi from 'joi';
import { TwitterCredentials, ServerConfig, RateLimitConfig } from './types.js';

dotenv.config();

const envSchema = Joi.object({
  // Twitter API Credentials
  TWITTER_API_KEY: Joi.string().required(),
  TWITTER_API_SECRET: Joi.string().required(),
  TWITTER_ACCESS_TOKEN: Joi.string().required(),
  TWITTER_ACCESS_TOKEN_SECRET: Joi.string().required(),
  TWITTER_BEARER_TOKEN: Joi.string().required(),

  // Server Configuration
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('production'),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(300),
}).unknown();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

export const twitterCredentials: TwitterCredentials = {
  apiKey: value.TWITTER_API_KEY,
  apiSecret: value.TWITTER_API_SECRET,
  accessToken: value.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: value.TWITTER_ACCESS_TOKEN_SECRET,
  bearerToken: value.TWITTER_BEARER_TOKEN,
};

export const serverConfig: ServerConfig = {
  nodeEnv: value.NODE_ENV,
  logLevel: value.LOG_LEVEL,
};

export const rateLimitConfig: RateLimitConfig = {
  windowMs: value.RATE_LIMIT_WINDOW_MS,
  maxRequests: value.RATE_LIMIT_MAX_REQUESTS,
};

export const isDevelopment = serverConfig.nodeEnv === 'development';
export const isProduction = serverConfig.nodeEnv === 'production'; 