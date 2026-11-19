import { describe, expect, it } from 'vitest';
import { findCategory, type CategoryRuleInput } from './categorize.js';

const rule = (overrides: Partial<CategoryRuleInput>): CategoryRuleInput => ({
  id: 'r',
  categoryId: 'c',
  pattern: '',
  matchType: 'CONTAINS',
  priority: 0,
  ...overrides,
});

describe('findCategory', () => {
  it('retourne null sans règle correspondante', () => {
    expect(findCategory('CB BOULANGERIE', [rule({ pattern: 'LOYER' })])).toBeNull();
  });

  it('applique une règle « contient » sans tenir compte des accents ni de la casse', () => {
    const rules = [rule({ categoryId: 'alimentation', pattern: 'boulangerie' })];
    expect(findCategory('CB Boulangérie Martin', rules)).toBe('alimentation');
  });

  it('applique une règle « commence par »', () => {
    const rules = [rule({ categoryId: 'logement', pattern: 'PRLV LOYER', matchType: 'STARTS_WITH' })];
    expect(findCategory('PRLV LOYER NOVEMBRE', rules)).toBe('logement');
    expect(findCategory('VIR PRLV LOYER', rules)).toBeNull();
  });

  it('applique une règle « égal à »', () => {
    const rules = [rule({ categoryId: 'abonnements', pattern: 'NETFLIX', matchType: 'EQUALS' })];
    expect(findCategory('netflix', rules)).toBe('abonnements');
    expect(findCategory('NETFLIX.COM', rules)).toBeNull();
  });

  it('retient la règle la plus prioritaire', () => {
    const rules = [
      rule({ id: 'a', categoryId: 'courses', pattern: 'CARREFOUR', priority: 1 }),
      rule({ id: 'b', categoryId: 'carburant', pattern: 'CARREFOUR STATION', priority: 10 }),
    ];
    expect(findCategory('CB CARREFOUR STATION', rules)).toBe('carburant');
  });

  it('départage deux règles de même priorité par identifiant, de façon stable', () => {
    const rules = [
      rule({ id: 'b', categoryId: 'deuxieme', pattern: 'AMAZON' }),
      rule({ id: 'a', categoryId: 'premiere', pattern: 'AMAZON' }),
    ];
    expect(findCategory('AMAZON MARKETPLACE', rules)).toBe('premiere');
  });

  it('ignore une règle dont le motif est vide', () => {
    const rules = [rule({ categoryId: 'vide', pattern: '   ', priority: 99 })];
    expect(findCategory('CB BOULANGERIE', rules)).toBeNull();
  });
});
