'use strict';

/**
 * CloudinaryAPI
 * Single responsibility: all communication with the Cloudinary API,
 * and URL construction for transformations.
 *
 * CORS ARCHITECTURE NOTE:
 * Cloudinary's Admin API (/resources) does not allow browser CORS.
 * We work around this with a "JSON index" approach:
 *   - A file `icon-index.json` is stored in Cloudinary as a raw resource.
 *   - It is fetched via the CDN delivery URL (res.cloudinary.com) which IS CORS-safe.
 *   - It is updated by re-uploading it as a raw file after every mutation.
 * The upload, destroy, and tags APIs all support CORS from browsers.
 */
class CloudinaryAPI {
  #cloudName;
  #apiKey;
  #apiSecret;
  #uploadPreset;
  #uploadUrl;
  #INDEX_PUBLIC_ID = 'icon-index';

  /** @param {{ cloudName, apiKey, apiSecret, uploadPreset }} creds */
  constructor(creds) {
    this.#cloudName    = creds.cloudName;
    this.#apiKey       = creds.apiKey;
    this.#apiSecret    = creds.apiSecret;
    this.#uploadPreset = creds.uploadPreset;
    this.#uploadUrl    = `https://api.cloudinary.com/v1_1/${this.#cloudName}`;
  }

  // ── SHA-1 signing (Web Crypto, no libs) ──────────────────────────────────

  async #sign(params) {
    const str = Object.keys(params)
      .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&') + this.#apiSecret;

    const buf  = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ── JSON index: fetch ─────────────────────────────────────────────────────

  /**
   * Load the icon index from Cloudinary CDN.
   * Returns [] if it doesn't exist yet (first run).
   * @returns {Promise<Array>} array of asset objects
   */
  async fetchIndex() {
    // Cache-bust with timestamp so we always get the latest version
    const url = `https://res.cloudinary.com/${this.#cloudName}/raw/upload/${this.#INDEX_PUBLIC_ID}.json?_=${Date.now()}`;
    try {
      const res = await fetch(url);
      if (res.status === 404) return [];
      if (!res.ok) throw new Error(`Index fetch failed: HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      // If missing or parse error, start fresh
      if (err.message.includes('404') || err instanceof SyntaxError) return [];
      throw err;
    }
  }

  // ── JSON index: persist ───────────────────────────────────────────────────

  /**
   * Save the full asset array back to Cloudinary as a raw JSON file.
   * Uses a signed upload with overwrite: true so the same public_id is reused.
   * @param {Array} assets
   * @returns {Promise<void>}
   */
  async saveIndex(assets) {
    const timestamp = Math.floor(Date.now() / 1000);
    const params    = {
      overwrite:   true,
      public_id:   this.#INDEX_PUBLIC_ID,
      resource_type: 'raw',
      timestamp,
    };
    const signature = await this.#sign(params);

    const blob     = new Blob([JSON.stringify(assets)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file',          blob, 'icon-index.json');
    formData.append('public_id',     this.#INDEX_PUBLIC_ID);
    formData.append('overwrite',     'true');
    formData.append('resource_type', 'raw');
    formData.append('timestamp',     timestamp);
    formData.append('api_key',       this.#apiKey);
    formData.append('signature',     signature);

    const res = await fetch(`${this.#uploadUrl}/raw/upload`, { method: 'POST', body: formData });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error?.message || `Index save failed: HTTP ${res.status}`);
    }
  }

  // ── Image upload ──────────────────────────────────────────────────────────

  /**
   * Upload an image file. Returns the Cloudinary resource object.
   * After upload, caller is responsible for adding it to the index.
   * @param {File}     file
   * @param {string[]} tags
   * @param {function(number):void} onProgress
   * @returns {Promise<Object>}
   */
  uploadAsset(file, tags = [], onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      const fd = new FormData();
      fd.append('file',           file);
      fd.append('upload_preset',  this.#uploadPreset);
      fd.append('resource_type',  'image');
      if (tags.length) fd.append('tags', tags.join(','));

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) onProgress(Math.round(e.loaded / e.total * 100));
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { resolve(JSON.parse(xhr.responseText)); }
          catch { reject(new Error('Invalid JSON from upload')); }
        } else {
          let msg = `HTTP ${xhr.status}`;
          try { msg = JSON.parse(xhr.responseText).error?.message || msg; } catch {}
          reject(new Error(msg));
        }
      });
      xhr.addEventListener('error', () => reject(new Error('Network error')));
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));
      xhr.open('POST', `${this.#uploadUrl}/image/upload`);
      xhr.send(fd);
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  /**
   * Destroy an image by public_id (signed). Caller removes it from index.
   * @param {string} publicId
   * @returns {Promise<Object>}
   */
  async deleteAsset(publicId) {
    const timestamp = Math.floor(Date.now() / 1000);
    const params    = { public_id: publicId, timestamp };
    const signature = await this.#sign(params);

    const fd = new FormData();
    fd.append('public_id', publicId);
    fd.append('timestamp', timestamp);
    fd.append('api_key',   this.#apiKey);
    fd.append('signature', signature);

    const res = await fetch(`${this.#uploadUrl}/image/destroy`, { method: 'POST', body: fd });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error?.message || `HTTP ${res.status}`);
    }
    return res.json();
  }

  // ── Tags (local only — stored in index, not via Cloudinary tags API) ──────
  // The Cloudinary tags API also has CORS issues for some account types.
  // We store tags inside our JSON index instead — fully CORS-safe.

  // ── URL builder ───────────────────────────────────────────────────────────

  /**
   * Build a transformation delivery URL. Pure string construction.
   * @param {string} publicId
   * @param {string} format  - output format ('', 'png', 'webp', etc.)
   * @param {Object} tf      - transform options (see jsdoc on fields)
   * @returns {string}
   */
  buildTransformUrl(publicId, format = '', tf = {}) {
    const p = [];
    if (tf.width)  p.push(`w_${tf.width}`);
    if (tf.height) p.push(`h_${tf.height}`);
    if (tf.width || tf.height) p.push('c_fit');
    if (tf.quality  && tf.quality  < 100) p.push(`q_${tf.quality}`);
    if (tf.hue      && tf.hue      !== 0) p.push(`e_hue:${tf.hue}`);
    if (tf.saturation && tf.saturation !== 0) p.push(`e_saturation:${tf.saturation}`);
    if (tf.brightness && tf.brightness !== 0) p.push(`e_brightness:${tf.brightness}`);
    if (tf.contrast && tf.contrast !== 0) p.push(`e_contrast:${tf.contrast}`);
    if (tf.grayscale)  p.push('e_grayscale');
    if (tf.negate)     p.push('e_negate');
    if (tf.blackwhite) p.push('e_blackwhite');
    if (tf.blur    && tf.blur    > 0) p.push(`e_blur:${tf.blur}`);
    if (tf.sharpen && tf.sharpen > 0) p.push(`e_sharpen:${tf.sharpen}`);
    if (tf.opacity !== undefined && tf.opacity < 100) p.push(`o_${tf.opacity}`);

    const tfStr = p.length ? p.join(',') + '/' : '';
    const ext   = format ? `.${format}` : '';
    return `https://res.cloudinary.com/${this.#cloudName}/image/upload/${tfStr}${publicId}${ext}`;
  }

  getRawUrl(publicId, format = '') {
    return this.buildTransformUrl(publicId, format, {});
  }

  get cloudName() { return this.#cloudName; }
}
