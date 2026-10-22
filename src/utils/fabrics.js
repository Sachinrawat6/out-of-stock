export const fabricNumbers = (styleNumber, stocks) => {
  let normalizeStyleNumber = styleNumber.toString();
  if (normalizeStyleNumber.startsWith('6')) {
    normalizeStyleNumber = normalizeStyleNumber.slice(1);
  }
  const fabrics = stocks.filter((s) => s.styleNumbers.includes(Number(normalizeStyleNumber))) || [];
  return fabrics;
};
