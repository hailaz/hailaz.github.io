/**
 * ID 生成器（类 nanoid，无外部依赖）
 */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function nid(prefix = 'n') {
  let s = '';
  for (let i = 0; i < 8; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${prefix}_${s}`;
}
