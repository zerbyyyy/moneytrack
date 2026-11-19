import { z } from 'zod';

/**
 * Schémas de validation partagés entre l'API et l'interface.
 * Les montants circulent sous forme de chaînes décimales ("-12.50")
 * pour éviter toute erreur d'arrondi liée aux nombres flottants.
 */

export const amountSchema = z
  .string()
  .trim()
  .regex(/^-?\d{1,10}(\.\d{1,2})?$/, 'Montant invalide (ex. : -12.50)');

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide (format attendu : AAAA-MM-JJ)');

// Authentification (US-01)
export const emailSchema = z.string().trim().toLowerCase().email('Adresse e-mail invalide').max(254);

export const passwordSchema = z
  .string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
  .max(128, 'Le mot de passe ne doit pas dépasser 128 caractères');

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

// Comptes bancaires (US-02)
export const accountTypeSchema = z.enum(['CHECKING', 'SAVINGS', 'OTHER']);

export const accountInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  type: accountTypeSchema,
  currency: z.string().length(3).default('EUR'),
  initialBalance: amountSchema.default('0'),
});

// Transactions (US-03)
export const transactionInputSchema = z.object({
  accountId: z.string().uuid(),
  amount: amountSchema,
  transactionDate: isoDateSchema,
  label: z.string().trim().min(1).max(255),
  categoryId: z.string().uuid().nullable().optional(),
});

// Correspondance des colonnes d'un relevé CSV (US-04)
export const csvMappingSchema = z.object({
  delimiter: z.enum([';', ',', '\t']),
  encoding: z.enum(['utf-8', 'iso-8859-1']),
  hasHeader: z.boolean(),
  dateColumn: z.number().int().min(0),
  dateFormat: z.enum(['DD/MM/YYYY', 'YYYY-MM-DD']),
  amountColumn: z.number().int().min(0),
  labelColumn: z.number().int().min(0),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AccountType = z.infer<typeof accountTypeSchema>;
export type AccountInput = z.infer<typeof accountInputSchema>;
export type TransactionInput = z.infer<typeof transactionInputSchema>;
export type CsvMapping = z.infer<typeof csvMappingSchema>;

export interface HealthResponse {
  status: 'ok';
}
