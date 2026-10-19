'use strict';

/**
 * AuthService
 * Single responsibility: manage Cloudinary credentials in localStorage.
 * No rendering, no API calls.
 */
class AuthService {
  static #STORAGE_KEY = 'iconmanager_credentials';

  /**
   * Returns true if valid credentials exist in localStorage.
   * @returns {boolean}
   */
  hasCredentials() {
    const creds = this.getCredentials();
    return !!(creds && creds.cloudName && creds.apiKey && creds.apiSecret && creds.uploadPreset);
  }

  /**
   * Persist credentials to localStorage.
   * @param {string} cloudName
   * @param {string} apiKey
   * @param {string} apiSecret
   * @param {string} uploadPreset
   */
  saveCredentials(cloudName, apiKey, apiSecret, uploadPreset) {
    const creds = {
      cloudName:    cloudName.trim(),
      apiKey:       apiKey.trim(),
      apiSecret:    apiSecret.trim(),
      uploadPreset: uploadPreset.trim(),
    };
    localStorage.setItem(AuthService.#STORAGE_KEY, JSON.stringify(creds));
  }

  /**
   * Retrieve stored credentials.
   * @returns {{ cloudName: string, apiKey: string, apiSecret: string, uploadPreset: string } | null}
   */
  getCredentials() {
    try {
      const raw = localStorage.getItem(AuthService.#STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Remove credentials from localStorage (logout).
   */
  clearCredentials() {
    localStorage.removeItem(AuthService.#STORAGE_KEY);
  }
}
