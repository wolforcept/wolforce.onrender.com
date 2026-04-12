/* -------------------------
   Debug flag
   Set to true to enable verbose console logging for troubleshooting
   cross-environment encoding/decoding issues.
   ------------------------- */

const ENCODER_DEBUG = true;

function _dbg(...args) {
  if (ENCODER_DEBUG) console.log("[encoder]", ...args);
}

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
  const skipped = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i].toUpperCase();
    const idx = CROCKFORD.indexOf(ch);
    if (idx === -1) {
      skipped.push({ pos: i, char: str[i], code: str.charCodeAt(i) });
      continue;
    }
    value = (value << 5) | idx;
    bits += 5;
    while (bits >= 8) {
      bits -= 8;
      out.push((value >>> bits) & 0xff);
    }
  }
  if (ENCODER_DEBUG && skipped.length > 0) {
    _dbg(`base32Decode: skipped ${skipped.length} unrecognised character(s):`, skipped);
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
   High-level encode / decode
   ------------------------- */

function encodeTitleToCode(title) {
  _dbg("encodeTitleToCode() called");
  _dbg("  input type   :", typeof title);
  _dbg("  input length :", title.length, "chars");
  _dbg("  input preview:", JSON.stringify(title.slice(0, 80)) + (title.length > 80 ? "…" : ""));

  // Log any non-ASCII codepoints — useful for spotting Unicode normalization issues
  if (ENCODER_DEBUG) {
    const nonAscii = [];
    for (let i = 0; i < title.length; i++) {
      const cp = title.codePointAt(i);
      if (cp > 127) nonAscii.push({ pos: i, char: title[i], codePoint: cp.toString(16).toUpperCase() });
    }
    if (nonAscii.length > 0) {
      _dbg("  non-ASCII codepoints found (watch for normalization issues):", nonAscii);
    } else {
      _dbg("  all characters are ASCII — no normalization risk");
    }

    // Warn about line endings
    const hasCRLF = title.includes("\r\n");
    const hasCR   = !hasCRLF && title.includes("\r");
    if (hasCRLF) _dbg("  WARNING: input contains CRLF (\\r\\n) line endings — will differ from LF-only environments");
    else if (hasCR) _dbg("  WARNING: input contains bare CR (\\r) line endings");
    else if (title.includes("\n")) _dbg("  input contains LF (\\n) line endings");
  }

  const data = utf8ToBytes(title);
  _dbg("  utf8 byte length:", data.length);

  if (data.length > 0xffff) {
    throw new Error(
      `Input too long: ${data.length} bytes exceeds the maximum of 65535 bytes. ` +
      `Try shortening the string (current length: ${title.length} characters).`
    );
  }

  // Prefix with 2-byte little-endian length
  const withLen = new Uint8Array(data.length + 2);
  withLen[0] = data.length & 0xff;
  withLen[1] = (data.length >>> 8) & 0xff;
  withLen.set(data, 2);
  _dbg("  length-prefixed bytes (first 8):", Array.from(withLen.slice(0, 8)));

  const words = bytesToWordsBE(withLen);
  _dbg("  word count:", words.length);
  _dbg("  plain words (hex):", words.map(w => w.toString(16).padStart(8, "0")));

  const encWords = words.map((w) => feistelEncryptWord(w));
  _dbg("  encrypted words (hex):", encWords.map(w => w.toString(16).padStart(8, "0")));

  const encBytes = wordsBEToBytes(encWords);
  const b32 = base32Encode(encBytes);
  _dbg("  base32 (no dashes):", b32);

  const check = computeChecksum(encBytes);
  _dbg("  checksum:", check);

  const grouped = b32.match(/.{1,4}/g).join("-");
  const result = grouped + "-" + check;
  _dbg("  final code:", result);

  return result;
}

function decodeCodeToTitle(code) {
  _dbg("decodeCodeToTitle() called");
  _dbg("  raw input:", JSON.stringify(code));

  if (typeof code !== "string") {
    throw new Error(
      `Expected a string but received ${typeof code}. ` +
      `Make sure you are passing the encoded code as a plain string.`
    );
  }

  if (code.trim() === "") {
    throw new Error("Input is empty. Paste a valid encoded code to decode.");
  }

  const normalized = code.toUpperCase().replace(/\s/g, "");
  _dbg("  normalized (uppercase, no whitespace):", normalized);

  const parts = normalized.split("-");
  _dbg("  parts after splitting on '-':", parts);

  if (parts.length < 2) {
    throw new Error(
      `Missing checksum: the code must end with a 2-character checksum group separated by '-'. ` +
      `Got ${parts.length} part(s) — are the dashes present?`
    );
  }

  const checkPart = parts.pop();
  _dbg("  checksum part (popped):", checkPart);
  _dbg("  payload parts remaining:", parts);

  if (checkPart.length !== 2) {
    throw new Error(
      `Invalid checksum: expected the last group to be exactly 2 characters, ` +
      `but got ${checkPart.length} character(s) ("${checkPart}"). ` +
      `The code may be truncated or have extra characters at the end.`
    );
  }

  // Check that checksum characters are valid Crockford Base32
  for (const ch of checkPart) {
    if (CROCKFORD.indexOf(ch) === -1) {
      throw new Error(
        `Invalid checksum character '${ch}' (char code ${ch.charCodeAt(0)}). ` +
        `Valid Crockford Base32 characters are: ${CROCKFORD}`
      );
    }
  }

  const clean = parts.join("");
  _dbg("  joined payload (no dashes):", clean);
  _dbg("  payload length:", clean.length, "base32 chars");

  // Check for invalid characters in the payload before decoding
  if (ENCODER_DEBUG) {
    const invalid = [];
    for (let i = 0; i < clean.length; i++) {
      if (CROCKFORD.indexOf(clean[i]) === -1) {
        invalid.push({ pos: i, char: clean[i], code: clean.charCodeAt(i) });
      }
    }
    if (invalid.length > 0) {
      _dbg("  WARNING: invalid Base32 characters in payload (will be silently skipped during decode):", invalid);
    }
  }

  const bytes = base32Decode(clean);
  _dbg("  decoded byte count:", bytes.length);
  _dbg("  decoded bytes (first 8):", Array.from(bytes.slice(0, 8)));

  if (bytes.length === 0) {
    throw new Error(
      `Decoded payload is empty. The code "${code}" produced no bytes after Base32 decoding. ` +
      `The code may be completely invalid or corrupted.`
    );
  }

  // Verify checksum BEFORE attempting to decrypt — gives a clear error on corruption
  const expectedCheck = computeChecksum(bytes);
  _dbg("  checksum expected:", expectedCheck, "  received:", checkPart);

  if (!verifyChecksum(bytes, checkPart)) {
    throw new Error(
      `Checksum mismatch: expected "${expectedCheck}" but got "${checkPart}". ` +
      `The code is corrupted or was modified after encoding. ` +
      `Common causes: typo in the code, line-ending differences (CRLF vs LF), ` +
      `Unicode normalization differences, or copy-paste errors.`
    );
  }
  _dbg("  checksum OK");

  const padded = new Uint8Array(Math.ceil(bytes.length / 4) * 4);
  padded.set(bytes, 0);
  _dbg("  padded to word boundary:", padded.length, "bytes");

  const words = bytesToWordsBE(padded);
  _dbg("  encrypted words (hex):", words.map(w => w.toString(16).padStart(8, "0")));

  const decWords = words.map((w) => feistelDecryptWord(w));
  _dbg("  decrypted words (hex):", decWords.map(w => w.toString(16).padStart(8, "0")));

  const raw = wordsBEToBytes(decWords);
  _dbg("  raw bytes after decrypt (first 8):", Array.from(raw.slice(0, 8)));

  const len = raw[0] | (raw[1] << 8);
  _dbg("  embedded length prefix:", len, "bytes");

  if (len < 0 || len > raw.length - 2) {
    throw new Error(
      `Corrupt length field: the embedded length is ${len} bytes, but only ${raw.length - 2} ` +
      `bytes of data are available after the length prefix. ` +
      `This usually means the code was generated by a different version of the encoder, ` +
      `or the payload is corrupted.`
    );
  }

  const data = raw.slice(2, 2 + len);
  _dbg("  extracted data bytes:", data.length);

  const result = bytesToUtf8(data);
  _dbg("  decoded string preview:", JSON.stringify(result.slice(0, 80)) + (result.length > 80 ? "…" : ""));
  _dbg("  decoded string length:", result.length, "chars");

  return result;
}