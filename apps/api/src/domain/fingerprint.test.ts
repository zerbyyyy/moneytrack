import { describe, expect, it } from 'vitest';
import { computeFingerprints, type ParsedRow } from './fingerprint.js';

const ACCOUNT_A = '11111111-1111-1111-1111-111111111111';
const ACCOUNT_B = '22222222-2222-2222-2222-222222222222';

const coffee: ParsedRow = { date: '2026-11-19', amount: '-2.50', label: 'CB CAFE DU COIN' };
const rent: ParsedRow = { date: '2026-11-05', amount: '-650.00', label: 'PRLV LOYER' };

describe('computeFingerprints', () => {
  it('produit une empreinte SHA-256 hexadécimale par ligne', () => {
    const [hash] = computeFingerprints(ACCOUNT_A, [coffee]);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('donne les mêmes empreintes quand le même fichier est réimporté', () => {
    const rows = [coffee, rent];
    expect(computeFingerprints(ACCOUNT_A, rows)).toEqual(computeFingerprints(ACCOUNT_A, rows));
  });

  it('distingue deux achats identiques le même jour dans un même fichier', () => {
    const [first, second] = computeFingerprints(ACCOUNT_A, [coffee, { ...coffee }]);
    expect(first).not.toBe(second);
  });

  it("reconnaît une ligne déjà importée même si d'autres lignes s'ajoutent au relevé", () => {
    const [firstImport] = computeFingerprints(ACCOUNT_A, [coffee]);
    const secondImport = computeFingerprints(ACCOUNT_A, [rent, coffee]);
    expect(secondImport).toContain(firstImport);
  });

  it('distingue la même ligne sur deux comptes différents', () => {
    const [onA] = computeFingerprints(ACCOUNT_A, [coffee]);
    const [onB] = computeFingerprints(ACCOUNT_B, [coffee]);
    expect(onA).not.toBe(onB);
  });

  it('ignore les différences de format du montant et de casse du libellé', () => {
    const [original] = computeFingerprints(ACCOUNT_A, [coffee]);
    const [variant] = computeFingerprints(ACCOUNT_A, [
      { date: '2026-11-19', amount: '-2,5', label: '  cb café   du coin ' },
    ]);
    expect(variant).toBe(original);
  });
});
