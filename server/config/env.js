import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().pipe(z.coerce.number().min(1024).max(65535)).default('3001'),
  MONGODB_URI: z.string().url('Invalid MongoDB URI format'),
  DB_NAME: z.string().default('roadDamageReporter'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

let validatedEnv;

export function validateEnv() {
  try {
    validatedEnv = envSchema.parse(process.env);
    console.log(`✓ Environment validated for ${validatedEnv.NODE_ENV} mode`);
    return validatedEnv;
  } catch (error) {
    console.error('❌ Environment validation failed:');
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

export function getEnv() {
  if (!validatedEnv) {
    throw new Error('Environment not validated. Call validateEnv() first.');
  }
  return validatedEnv;
}
