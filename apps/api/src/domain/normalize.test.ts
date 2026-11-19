import { describe, expect, it } from 'vitest';
import { normalizeLabel, toCents } from './normalize.js';

describe('normalizeLabel', () => {
  it('supprime les accents, met en majuscules et réduit les espaces', () => {
    expect(normalizeLabel('  Carte   Boulangerie   Élise ')).toBe('CARTE BOULANGERIE ELISE');
  });
});

describe('toCents', () => {
  it.each([
    ['12.50', '1250'],
    ['12,5', '1250'],
    ['-12.50', '-1250'],
    ['1 234,00', '123400'],
    ['0', '0'],
    ['-0.00', '0'],
    ['7', '700'],
  ])('convertit "%s" en %s centimes', (input, expected) => {
    expect(toCents(input)).toBe(expected);
  });

  it.each(['', 'abc', '12.345', '1,2,3', '--5'])('refuse le montant invalide "%s"', (input) => {
    expect(() => toCents(input)).toThrow('Montant invalide');
  });
});
