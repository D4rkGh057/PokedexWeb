// src/helper/utils.js

/**
 * Formatea un string para capitalizar y reemplazar guiones por espacios.
 */
export function formatString(str) {
  if (!str) return '';
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Obtiene el flavor text en inglés de un item (si existe).
 */
export function getEnglishFlavorText(item) {
  if (!item || !item.flavor_text_entries) return '';
  const entry = item.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );
  return entry ? entry.text : '';
}
