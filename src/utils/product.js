export const getStyleNumber = (product) => {
  const sku = product.variants?.edges?.[0]?.node?.sku || '';
  return sku.split('-')[0] || 'N/A';
};

export const smallImage = (url, width = 300) => {
  if (!url) return null;
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}width=${width}`;
};

export const uniqueByStyle = (products) => {
  const map = new Map();
  products.forEach((p) => {
    const styleNumber = getStyleNumber(p);
    if (!map.has(styleNumber)) map.set(styleNumber, { ...p, styleNumber });
  });
  return [...map.values()];
};
