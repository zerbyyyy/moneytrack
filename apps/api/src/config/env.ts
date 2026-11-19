import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET doit contenir au moins 32 caractères'),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

/** Lit et valide la configuration une seule fois ; échoue au démarrage si elle est incomplète. */
export function getEnv(): Env {
  if (!cached) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((issue) => `${issue.path.join('.')} : ${issue.message}`)
        .join(' ; ');
      throw new Error(`Configuration invalide (${details})`);
    }
    cached = parsed.data;
  }
  return cached;
}
