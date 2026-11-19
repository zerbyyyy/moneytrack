import { normalizeLabel } from './normalize.js';

export type MatchType = 'CONTAINS' | 'STARTS_WITH' | 'EQUALS';

export interface CategoryRuleInput {
  id: string;
  categoryId: string;
  pattern: string;
  matchType: MatchType;
  /** Plus la valeur est élevée, plus la règle est prioritaire */
  priority: number;
}

function matches(label: string, pattern: string, matchType: MatchType): boolean {
  switch (matchType) {
    case 'CONTAINS':
      return label.includes(pattern);
    case 'STARTS_WITH':
      return label.startsWith(pattern);
    case 'EQUALS':
      return label === pattern;
  }
}

/**
 * Retourne la catégorie de la première règle qui correspond au libellé (US-06),
 * par ordre de priorité décroissante, ou null si aucune règle ne s'applique.
 * À priorité égale, l'ordre est stable (tri par identifiant).
 */
export function findCategory(label: string, rules: CategoryRuleInput[]): string | null {
  const normalizedLabel = normalizeLabel(label);
  const sorted = [...rules].sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));

  for (const rule of sorted) {
    const pattern = normalizeLabel(rule.pattern);
    if (pattern !== '' && matches(normalizedLabel, pattern, rule.matchType)) {
      return rule.categoryId;
    }
  }
  return null;
}
