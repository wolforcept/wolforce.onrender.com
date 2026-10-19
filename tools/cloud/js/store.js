'use strict';

/**
 * Store
 * Single responsibility: hold all application state and notify observers on change.
 * No rendering, no API calls, no DOM access.
 */
class Store {
  #state = {
    assets:        [],   // all loaded Cloudinary resources
    nextCursor:    null, // for pagination
    searchQuery:   '',
    sortBy:        'created_at',
    sortDir:       'desc',
    formatFilter:  '',
    activeTag:     null,
    activeFilter:  'all', // 'all' | 'recent'
    selectedAsset: null,
    isLoading:     false,
    view:          'grid', // 'grid' | 'list'
  };

  #subscribers = [];

  // ── Subscription ─────────────────────────────────────────────────────────

  /**
   * Register a callback invoked on every state change.
   * @param {function(state: object): void} fn
   * @returns {function} unsubscribe function
   */
  subscribe(fn) {
    this.#subscribers.push(fn);
    return () => {
      this.#subscribers = this.#subscribers.filter(s => s !== fn);
    };
  }

  #notify() {
    const snapshot = this.#snapshot();
    this.#subscribers.forEach(fn => fn(snapshot));
  }

  #snapshot() {
    return Object.freeze({ ...this.#state });
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  getState() {
    return this.#snapshot();
  }

  /**
   * Returns assets filtered by search query, format, tag, and recency,
   * then sorted according to sortBy/sortDir.
   * @returns {Array}
   */
  getFilteredAssets() {
    const { assets, searchQuery, sortBy, sortDir, formatFilter, activeTag, activeFilter } = this.#state;

    let result = [...assets];

    // Filter: recent (last 7 days)
    if (activeFilter === 'recent') {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      result = result.filter(a => new Date(a.created_at).getTime() > cutoff);
    }

    // Filter: active tag
    if (activeTag) {
      result = result.filter(a => Array.isArray(a.tags) && a.tags.includes(activeTag));
    }

    // Filter: format
    if (formatFilter) {
      result = result.filter(a => a.format === formatFilter);
    }

    // Filter: search query (matches public_id / filename)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(a => {
        const name = (a.public_id || '').toLowerCase();
        const tags = (a.tags || []).join(' ').toLowerCase();
        return name.includes(q) || tags.includes(q);
      });
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }

  /**
   * Returns a map of tag → count across all assets.
   * @returns {Object.<string, number>}
   */
  getTagCounts() {
    const counts = {};
    this.#state.assets.forEach(a => {
      (a.tags || []).forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }

  // ── Setters (each triggers notify) ───────────────────────────────────────

  setAssets(assets, nextCursor = null) {
    this.#state.assets = assets;
    this.#state.nextCursor = nextCursor;
    this.#notify();
  }

  appendAssets(assets, nextCursor = null) {
    this.#state.assets = [...this.#state.assets, ...assets];
    this.#state.nextCursor = nextCursor;
    this.#notify();
  }

  setSearch(query) {
    this.#state.searchQuery = query;
    this.#notify();
  }

  setSort(sortBy, sortDir) {
    this.#state.sortBy  = sortBy;
    this.#state.sortDir = sortDir;
    this.#notify();
  }

  setFormatFilter(format) {
    this.#state.formatFilter = format;
    this.#notify();
  }

  setActiveTag(tag) {
    this.#state.activeTag    = tag;
    this.#state.activeFilter = 'all';
    this.#notify();
  }

  setActiveFilter(filter) {
    this.#state.activeFilter = filter;
    this.#state.activeTag    = null;
    this.#notify();
  }

  setSelectedAsset(asset) {
    this.#state.selectedAsset = asset;
    this.#notify();
  }

  setLoading(bool) {
    this.#state.isLoading = bool;
    this.#notify();
  }

  setView(view) {
    this.#state.view = view;
    this.#notify();
  }

  /**
   * Update a single asset in-place (e.g. after tag edit).
   * @param {string} publicId
   * @param {object} patch
   */
  patchAsset(publicId, patch) {
    this.#state.assets = this.#state.assets.map(a =>
      a.public_id === publicId ? { ...a, ...patch } : a
    );
    // Also update selectedAsset if it's the same one
    if (this.#state.selectedAsset && this.#state.selectedAsset.public_id === publicId) {
      this.#state.selectedAsset = { ...this.#state.selectedAsset, ...patch };
    }
    this.#notify();
  }

  /**
   * Remove a single asset from state (after deletion).
   * @param {string} publicId
   */
  removeAsset(publicId) {
    this.#state.assets = this.#state.assets.filter(a => a.public_id !== publicId);
    if (this.#state.selectedAsset && this.#state.selectedAsset.public_id === publicId) {
      this.#state.selectedAsset = null;
    }
    this.#notify();
  }
}
