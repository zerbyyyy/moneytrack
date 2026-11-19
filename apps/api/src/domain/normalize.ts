/**
 * Normalise un libellé bancaire pour pouvoir le comparer :
 * suppression des accents, majuscules, espaces multiples réduits.
 */
export function normalizeLabel(label: string): string {
  return label
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convertit un montant décimal ("-12,50", "12.5", "1 234,00") en centimes,
 * sous forme de chaîne ("-1250"), sans passer par un nombre flottant.
 */
export function toCents(amount: string): string {
  const cleaned = amount.replace(/\s/g, '').replace(',', '.');
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) {
    throw new Error(`Montant invalide : "${amount}"`);
  }
  const negative = cleaned.startsWith('-');
  const [integerPart = '0', decimalPart = ''] = cleaned.replace('-', '').split('.');
  const cents = BigInt(integerPart) * 100n + BigInt(decimalPart.padEnd(2, '0'));
  return (negative && cents !== 0n ? '-' : '') + cents.toString();
}
