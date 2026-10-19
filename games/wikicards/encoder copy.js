/* -------------------------
   Utilities and constants
   ------------------------- */

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Base32 Crockford

function base32Encode(bytes) {
  let bits = 0,
    value = 0,
    out = "";
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += CROCKFORD[(value >>> bits) & 31];
    }
  }
  if (bits > 0) out += CROCKFORD[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(str) {
  let bits = 0,
    value = 0,
    out = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i].toUpperCase();
    const idx = CROCKFORD.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    while (bits >= 8) {
      bits -= 8;
      out.push((value >>> bits) & 0xff);
    }
  }
  return new Uint8Array(out);
}

/* -------------------------
   UTF-8 helpers
   ------------------------- */

function utf8ToBytes(s) {
  return new TextEncoder().encode(s);
}
function bytesToUtf8(bytes) {
  return new TextDecoder().decode(bytes);
}

/* -------------------------
   Block packing (big-endian)
   Pack bytes into 32-bit words:
     word = (b0<<24) | (b1<<16) | (b2<<8) | b3
   ------------------------- */

function bytesToWordsBE(bytes) {
  const paddedLen = Math.ceil(bytes.length / 4) * 4;
  const out = [];
  for (let i = 0; i < paddedLen; i += 4) {
    const b0 = bytes[i] || 0;
    const b1 = bytes[i + 1] || 0;
    const b2 = bytes[i + 2] || 0;
    const b3 = bytes[i + 3] || 0;
    out.push(
      ((b0 << 24) >>> 0) | ((b1 << 16) >>> 0) | ((b2 << 8) >>> 0) | (b3 >>> 0),
    );
  }
  return out;
}

function wordsBEToBytes(words) {
  const out = new Uint8Array(words.length * 4);
  for (let i = 0; i < words.length; i++) {
    const w = words[i] >>> 0;
    out[i * 4 + 0] = (w >>> 24) & 0xff;
    out[i * 4 + 1] = (w >>> 16) & 0xff;
    out[i * 4 + 2] = (w >>> 8) & 0xff;
    out[i * 4 + 3] = w & 0xff;
  }
  return out;
}

/* -------------------------
   Feistel cipher (32-bit block)
   - Use big-endian word
   - Split into L = high 16 bits, R = low 16 bits
   - 3 rounds
   ------------------------- */

function roundFunc16(x, round) {
  // simple deterministic mixing -> 16-bit output
  x = (x ^ (0x9e3779b9 + round)) >>> 0;
  x = (x * 0x85ebca6b) >>> 0;
  return x & 0xffff;
}

function feistelEncryptWord(w, rounds = 3) {
  w = w >>> 0;
  let L = (w >>> 16) & 0xffff;
  let R = w & 0xffff;
  for (let i = 0; i < rounds; i++) {
    const newL = R;
    const newR = (L ^ roundFunc16(R, i)) & 0xffff;
    L = newL;
    R = newR;
  }
  return ((L << 16) | R) >>> 0;
}

function feistelDecryptWord(w, rounds = 3) {
  w = w >>> 0;
  let L = (w >>> 16) & 0xffff;
  let R = w & 0xffff;
  for (let i = rounds - 1; i >= 0; i--) {
    const prevR = L;
    const prevL = (R ^ roundFunc16(prevR, i)) & 0xffff;
    L = prevL;
    R = prevR;
  }
  return ((L << 16) | R) >>> 0;
}

/* -------------------------
   High-level encode / decode
   - Prefix with 2-byte little-endian length
   - Pack to words (big-endian)
   - Encrypt each word
   - Base32 encode and group
   ------------------------- */

// function encodeTitleToCode(title) {
//   const data = utf8ToBytes(title);
//   if (data.length > 0xffff) throw new Error("Title too long");

//   // prefix length (2 bytes little-endian)
//   const withLen = new Uint8Array(data.length + 2);
//   withLen[0] = data.length & 0xff;
//   withLen[1] = (data.length >>> 8) & 0xff;
//   withLen.set(data, 2);

//   const words = bytesToWordsBE(withLen);
//   const encWords = words.map((w) => feistelEncryptWord(w));
//   const encBytes = wordsBEToBytes(encWords);
//   const b32 = base32Encode(encBytes);

//   // group into 4-char blocks for readability
//   return b32.match(/.{1,4}/g).join("-");
// }

// function decodeCodeToTitle(code) {
//   const clean = code.replace(/-/g, "");
//   const bytes = base32Decode(clean);

//   // ensure bytes length is multiple of 4 (pad zeros if necessary)
//   const padded = new Uint8Array(Math.ceil(bytes.length / 4) * 4);
//   padded.set(bytes, 0);

//   const words = bytesToWordsBE(padded);
//   const decWords = words.map((w) => feistelDecryptWord(w));
//   const raw = wordsBEToBytes(decWords);

//   // read 2-byte little-endian length
//   const len = raw[0] | (raw[1] << 8);
//   if (len < 0 || len > raw.length - 2) throw new Error("Invalid length");
//   const data = raw.slice(2, 2 + len);
//   return bytesToUtf8(data);
// }















/* -------------------------
   Checksum (2 Base32 chars = 10 bits)
   XOR-fold all bytes, spread into two 5-bit groups
   ------------------------- */

function computeChecksum(bytes) {
  let acc = 0;
  for (let i = 0; i < bytes.length; i++) {
    // mix in position so transpositions are also caught
    acc = (acc ^ ((bytes[i] + i) & 0xff)) >>> 0;
    acc = ((acc << 3) | (acc >>> 5)) & 0xff; // rotate left 3
  }
  // produce 10 bits: high 5 and low 5
  const hi = (acc >>> 3) & 0x1f;
  const lo = acc & 0x1f;
  return CROCKFORD[hi] + CROCKFORD[lo];
}

function verifyChecksum(bytes, checkChars) {
  return computeChecksum(bytes) === checkChars.toUpperCase();
}

/* -------------------------
   Updated encode / decode
   ------------------------- */

function encodeTitleToCode(title) {
  const data = utf8ToBytes(title);
  if (data.length > 0xffff) throw new Error("Title too long");

  const withLen = new Uint8Array(data.length + 2);
  withLen[0] = data.length & 0xff;
  withLen[1] = (data.length >>> 8) & 0xff;
  withLen.set(data, 2);

  const words = bytesToWordsBE(withLen);
  const encWords = words.map((w) => feistelEncryptWord(w));
  const encBytes = wordsBEToBytes(encWords);
  const b32 = base32Encode(encBytes);

  // compute checksum over the raw encrypted bytes
  const check = computeChecksum(encBytes);

  // group payload into 4-char blocks, then append checksum as its own group
  const grouped = b32.match(/.{1,4}/g).join("-");
  return grouped + "-" + check;
}

function decodeCodeToTitle(code) {
  const parts = code.toUpperCase().replace(/\s/g, "").split("-");

  // last part is the 2-char checksum
  if (parts.length < 2) throw new Error("Missing checksum");
  const checkPart = parts.pop();
  if (checkPart.length !== 2) throw new Error("Invalid checksum length");

  const clean = parts.join("");
  const bytes = base32Decode(clean);

  // verify checksum before doing anything else
  if (!verifyChecksum(bytes, checkPart)) throw new Error("Invalid checksum length");

  const padded = new Uint8Array(Math.ceil(bytes.length / 4) * 4);
  padded.set(bytes, 0);

  const words = bytesToWordsBE(padded);
  const decWords = words.map((w) => feistelDecryptWord(w));
  const raw = wordsBEToBytes(decWords);

  const len = raw[0] | (raw[1] << 8);
  if (len < 0 || len > raw.length - 2) throw new Error("Invalid length");
  const data = raw.slice(2, 2 + len);
  return bytesToUtf8(data);
}