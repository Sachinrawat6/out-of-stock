// SKU "12764-Black-XXS" -> style number "12764"
export const getStyleNumber = (product) => {
  const sku = product.variants?.edges?.[0]?.node?.sku || '';
  return sku.split('-')[0] || 'N/A';
};

// Shopify CDN image ko chhota karne ke liye (page fast load hota hai)
export const smallImage = (url, width = 300) => {
  if (!url) return null;
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}width=${width}`;
};

// Style number ke hisaab se duplicate hata do aur styleNumber field add karo
export const uniqueByStyle = (products) => {
  const map = new Map();
  products.forEach((p) => {
    const styleNumber = getStyleNumber(p);
    if (!map.has(styleNumber)) map.set(styleNumber, { ...p, styleNumber });
  });
  return [...map.values()];
};
