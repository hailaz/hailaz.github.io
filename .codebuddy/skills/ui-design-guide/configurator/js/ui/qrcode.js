/**
 * 纯 JS QR Code 生成器（轻量版）
 * 仅支持 Byte 模式 + 自动选版本
 * 参考：ISO/IEC 18004 简化实现
 *
 * 使用：
 *   const svg = qrToSvg('http://example.com', { size: 240 });
 *   container.innerHTML = svg;
 */

export function qrToSvg(text, { size = 240, margin = 4, fg = '#000', bg = '#fff' } = {}) {
  const qr = makeQR(text);
  const cellCount = qr.length;
  const totalSize = cellCount + margin * 2;
  const cell = size / totalSize;

  let paths = '';
  for (let y = 0; y < cellCount; y++) {
    for (let x = 0; x < cellCount; x++) {
      if (qr[y][x]) {
        paths += `M${(x + margin) * cell},${(y + margin) * cell}h${cell}v${cell}h-${cell}z`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <path d="${paths}" fill="${fg}"/>
</svg>`;
}

/* ============ 简化 QR 生成（Byte 模式，L 容错） ============ */
function makeQR(text) {
  const data = new TextEncoder().encode(text);

  // 选版本（简化：1-10）
  const capacityL = [19, 34, 55, 80, 108, 136, 156, 194, 232, 274];
  let ver = 1;
  while (ver <= 10 && data.length + 2 > capacityL[ver - 1]) ver++;
  if (ver > 10) throw new Error('数据过长，超出支持范围');
  const size = 17 + ver * 4;

  // 构建数据比特流
  const bits = [];
  pushBits(bits, 0b0100, 4); // Byte 模式指示
  const lenBits = ver < 10 ? 8 : 16;
  pushBits(bits, data.length, lenBits);
  for (const b of data) pushBits(bits, b, 8);
  pushBits(bits, 0, 4); // 结束符
  while (bits.length % 8 !== 0) bits.push(0);
  // 补齐至容量
  const totalBytes = capacityL[ver - 1];
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let v = 0;
    for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
    bytes.push(v);
  }
  const pad = [0xec, 0x11];
  while (bytes.length < totalBytes) bytes.push(pad[bytes.length % 2]);

  // RS 纠错（简化：计算 EC codewords）
  const ecCount = ecCountFor(ver);
  const ecBytes = rsEncode(bytes, ecCount);
  const allBytes = [...bytes, ...ecBytes];

  // 放置模块
  const matrix = Array.from({ length: size }, () => Array(size).fill(null));
  placeFinders(matrix, size);
  placeTiming(matrix, size);
  placeAlign(matrix, size, ver);
  // Dark module
  matrix[(4 * ver) + 9][8] = 1;
  reserveFormat(matrix, size);

  // 数据置入（之字形）
  placeData(matrix, size, allBytes);

  // Mask（固定用 mask 0，简化）
  const mask = 0;
  applyMask(matrix, size, mask);
  drawFormat(matrix, size, mask, 1); // L

  // 转 0/1
  const out = [];
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) row.push(matrix[y][x] ? 1 : 0);
    out.push(row);
  }
  return out;
}

function pushBits(arr, n, count) {
  for (let i = count - 1; i >= 0; i--) arr.push((n >> i) & 1);
}

function placeFinders(m, size) {
  const draw = (ox, oy) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const v = (y === 0 || y === 6 || x === 0 || x === 6) ||
                  (x >= 2 && x <= 4 && y >= 2 && y <= 4);
        m[oy + y][ox + x] = v ? 1 : 0;
      }
    }
  };
  draw(0, 0); draw(size - 7, 0); draw(0, size - 7);
  // 分隔符
  for (let i = 0; i < 8; i++) {
    if (m[7]?.[i] == null) m[7][i] = 0;
    if (m[i]?.[7] == null) m[i][7] = 0;
    if (m[7]?.[size - 1 - i] == null) m[7][size - 1 - i] = 0;
    if (m[i]?.[size - 8] == null) m[i][size - 8] = 0;
    if (m[size - 8]?.[i] == null) m[size - 8][i] = 0;
    if (m[size - 1 - i]?.[7] == null) m[size - 1 - i][7] = 0;
  }
}

function placeTiming(m, size) {
  for (let i = 8; i < size - 8; i++) {
    const v = i % 2 === 0 ? 1 : 0;
    if (m[6][i] == null) m[6][i] = v;
    if (m[i][6] == null) m[i][6] = v;
  }
}

function placeAlign(m, size, ver) {
  const positions = alignPositions(ver);
  for (const py of positions) {
    for (const px of positions) {
      if (m[py][px] != null) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const ay = py + dy, ax = px + dx;
          if (ay < 0 || ay >= size || ax < 0 || ax >= size) continue;
          const v = (Math.abs(dy) === 2 || Math.abs(dx) === 2) ||
                    (dx === 0 && dy === 0);
          m[ay][ax] = v ? 1 : 0;
        }
      }
    }
  }
}

function alignPositions(ver) {
  if (ver <= 1) return [];
  const tbl = [
    [], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
    [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
  ];
  return tbl[ver] || [];
}

function reserveFormat(m, size) {
  for (let i = 0; i < 9; i++) {
    if (i !== 6 && m[8][i] == null) m[8][i] = 0;
    if (i !== 6 && m[i][8] == null) m[i][8] = 0;
  }
  for (let i = 0; i < 8; i++) {
    if (m[8][size - 1 - i] == null) m[8][size - 1 - i] = 0;
    if (m[size - 1 - i][8] == null) m[size - 1 - i][8] = 0;
  }
}

function placeData(m, size, bytes) {
  let bitIdx = 0;
  let up = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let i = 0; i < size; i++) {
      const y = up ? size - 1 - i : i;
      for (let c = 0; c < 2; c++) {
        const x = col - c;
        if (m[y][x] != null) continue;
        const byteI = bitIdx >>> 3;
        const bitI = 7 - (bitIdx & 7);
        const v = (bytes[byteI] >> bitI) & 1;
        m[y][x] = v;
        bitIdx++;
      }
    }
    up = !up;
  }
}

function applyMask(m, size, mask) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (isFunctionModule(y, x, size)) continue;
      let invert = false;
      switch (mask) {
        case 0: invert = (y + x) % 2 === 0; break;
      }
      if (invert) m[y][x] ^= 1;
    }
  }
}

function isFunctionModule(y, x, size) {
  // finders + format
  if (y < 9 && x < 9) return true;
  if (y < 9 && x >= size - 8) return true;
  if (y >= size - 8 && x < 9) return true;
  // timing
  if (y === 6 || x === 6) return true;
  return false;
}

function drawFormat(m, size, mask, ecLevel) {
  // ecLevel: L=1, M=0, Q=3, H=2
  const fmt = ((ecLevel << 3) | mask);
  const fmtBits = bchFormat(fmt);
  for (let i = 0; i < 15; i++) {
    const b = (fmtBits >> i) & 1;
    // Top-left vertical
    if (i < 6)      m[i][8] = b;
    else if (i < 8) m[i + 1][8] = b;
    else if (i < 9) m[8][7] = b;
    else            m[8][14 - i] = b;
    // Top-right + bottom-left
    if (i < 8)      m[8][size - 1 - i] = b;
    else            m[size - 15 + i][8] = b;
  }
}

function bchFormat(data) {
  let d = data << 10;
  const g = 0b10100110111;
  for (let i = 4; i >= 0; i--) {
    if (((d >> (i + 10)) & 1)) d ^= g << i;
  }
  return ((data << 10) | (d & 0x3ff)) ^ 0b101010000010010;
}

/* RS 编码（GF256） */
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x; GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();
function gfMul(a, b) { return (a === 0 || b === 0) ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]]; }

function rsGenerator(n) {
  let poly = [1];
  for (let i = 0; i < n; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], GF_EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data, ecLen) {
  const gen = rsGenerator(ecLen);
  const buf = [...data, ...new Array(ecLen).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const coef = buf[i];
    if (coef === 0) continue;
    for (let j = 0; j < gen.length; j++) {
      buf[i + j] ^= gfMul(gen[j], coef);
    }
  }
  return buf.slice(data.length);
}

function ecCountFor(ver) {
  // L 容错：ver 1~10 对应 ec codewords
  return [7, 10, 15, 20, 26, 18, 20, 24, 30, 18][ver - 1] || 7;
}
