import { createHash } from 'node:crypto';
import { normalizeLabel, toCents } from './normalize.js';

export interface ParsedRow {
  /** Date au format AAAA-MM-JJ */
  date: string;
  /** Montant décimal signé, tel que lu dans le relevé */
  amount: string;
  label: string;
}

/**
 * Calcule l'empreinte anti-doublon de chaque ligne d'un relevé (US-05).
 *
 * L'empreinte combine le compte, la date, le montant, le libellé normalisé
 * et le rang d'occurrence de cette combinaison dans le fichier. Ainsi :
 * - deux achats identiques le même jour donnent deux empreintes distinctes ;
 * - réimporter le même fichier redonne exactement les mêmes empreintes,
 *   ce qui permet de détecter les doublons grâce à la contrainte
 *   UNIQUE (account_id, hash_fingerprint).
 */
export function computeFingerprints(accountId: string, rows: ParsedRow[]): string[] {
  const occurrences = new Map<string, number>();

  return rows.map((row) => {
    const base = [accountId, row.date, toCents(row.amount), normalizeLabel(row.label)].join('|');
    const rank = (occurrences.get(base) ?? 0) + 1;
    occurrences.set(base, rank);
    return createHash('sha256').update(`${base}|${rank}`).digest('hex');
  });
}
