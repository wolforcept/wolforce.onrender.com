'use strict';

/**
 * App
 * Entry point: bootstraps all services, injects dependencies,
 * and wires cross-module events.
 *
 * INDEX STRATEGY:
 * Because Cloudinary's Admin API is CORS-blocked in browsers, we maintain
 * a `icon-index.json` raw file in Cloudinary that acts as our asset registry.
 * Every mutation (upload, delete, tag edit) updates both local state and
 * the remote index file. A "Rebuild index" button re-uploads the full index
 * in case it drifts from reality.
 */
class App {
  #auth;
  #store;
  #api;
  #renderer;
  #uploader;
  #editor;

  constructor() {
    this.#auth  = new AuthService();
    this.#store = new Store();
  }

  async init() {
    if (this.#auth.hasCredentials()) {
      this.#bootWithCredentials(this.#auth.getCredentials());
    } else {
      this.#showAuth();
    }
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  #showAuth() {
    this.#renderer = new Renderer(this.#store);
    this.#renderer.showAuthDialog();
    this.#bindAuthSubmit();
  }

  #bindAuthSubmit() {
    $('#btn-auth-submit').on('click', async () => {
      const cloudName    = $('#input-cloud-name').val().trim();
      const apiKey       = $('#input-api-key').val().trim();
      const apiSecret    = $('#input-api-secret').val().trim();
      const uploadPreset = $('#input-upload-preset').val().trim();

      if (!cloudName || !apiKey || !apiSecret || !uploadPreset) {
        this.#renderer.showAuthError('Please fill in all fields.');
        return;
      }

      this.#renderer.hideAuthError();
      $('#btn-auth-submit').prop('disabled', true).text('Connecting…');

      try {
        // Validate by attempting to fetch the index (CORS-safe)
        const testApi = new CloudinaryAPI({ cloudName, apiKey, apiSecret, uploadPreset });
        await testApi.fetchIndex(); // returns [] if not yet created — that's fine

        this.#auth.saveCredentials(cloudName, apiKey, apiSecret, uploadPreset);
        this.#renderer.hideAuthDialog();
        this.#bootWithCredentials({ cloudName, apiKey, apiSecret, uploadPreset });
      } catch (err) {
        this.#renderer.showAuthError(`Connection failed: ${err.message}`);
        $('#btn-auth-submit').prop('disabled', false).text('Connect');
      }
    });

    $('#auth-dialog input').on('keydown', e => {
      if (e.key === 'Enter') $('#btn-auth-submit').trigger('click');
    });
  }

  // ── Boot ──────────────────────────────────────────────────────────────────

  #bootWithCredentials(creds) {
    this.#api      = new CloudinaryAPI(creds);
    this.#renderer = new Renderer(this.#store);
    this.#uploader = new Uploader(this.#api);
    this.#editor   = new ImageEditor(this.#api);

    this.#store.subscribe(state => this.#renderer.render(state));

    this.#uploader.init();
    this.#editor.init();

    this.#bindToolbar();
    this.#bindSidebar();
    this.#bindModal();
    this.#bindUploadEvents();
    this.#bindEditorEvents();
    this.#bindTagEvents();
    this.#bindKeyboard();
    this.#bindLogout();

    $('#app').removeClass('hidden');
    this.#loadIndex();
  }

  // ── Index loading ─────────────────────────────────────────────────────────

  async #loadIndex() {
    this.#store.setLoading(true);
    try {
      const assets = await this.#api.fetchIndex();
      this.#store.setAssets(assets, null);
    } catch (err) {
      console.error('Failed to load index:', err);
      this.#showToast(`Failed to load icons: ${err.message}`, 'error');
    } finally {
      this.#store.setLoading(false);
    }
  }

  async #refreshIndex() {
    this.#store.setAssets([], null);
    await this.#loadIndex();
  }

  // ── Toolbar ───────────────────────────────────────────────────────────────

  #bindToolbar() {
    let searchTimer;
    $('#search-input').on('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => this.#store.setSearch(e.target.value), 200);
    });

    $('#sort-select').on('change', e => {
      const [by, dir] = e.target.value.split('-');
      this.#store.setSort(by, dir);
    });

    $('#format-filter').on('change', e => {
      this.#store.setFormatFilter(e.target.value);
    });

    $('#btn-refresh').on('click', () => this.#refreshIndex());

    $(document).on('click', '.view-btn', e => {
      this.#store.setView($(e.currentTarget).data('view'));
    });

    // Rebuild index: re-saves current in-memory assets to Cloudinary.
    // Use after uploading via Cloudinary dashboard directly.
    $('#btn-rebuild-index').on('click', async () => {
      const { assets } = this.#store.getState();
      if (!confirm(`Re-save the index with the current ${assets.length} icons? Use this if you've uploaded files directly via Cloudinary dashboard.`)) return;
      try {
        $('#btn-rebuild-index').prop('disabled', true).text('Saving…');
        await this.#api.saveIndex(assets);
        this.#showToast('Index saved to Cloudinary', 'success');
      } catch (err) {
        this.#showToast(`Rebuild failed: ${err.message}`, 'error');
      } finally {
        $('#btn-rebuild-index').prop('disabled', false).text('Rebuild index');
      }
    });
  }

  // ── Sidebar ───────────────────────────────────────────────────────────────

  #bindSidebar() {
    $(document).on('click', '.nav-item', e => {
      e.preventDefault();
      this.#store.setActiveFilter($(e.currentTarget).data('filter'));
    });
  }

  // ── Modal ─────────────────────────────────────────────────────────────────

  #bindModal() {
    $(document).on('asset:select', (e, asset) => {
      this.#store.setSelectedAsset(asset);
      const rawUrl = this.#api.getRawUrl(asset.public_id, asset.format);
      this.#renderer.showModal(asset, rawUrl);
      this.#editor.loadAsset(asset);
    });

    $('#btn-close-modal').on('click', () => this.#closeModal());
    $('#modal-overlay').on('click', e => {
      if ($(e.target).is('#modal-overlay')) this.#closeModal();
    });
  }

  #closeModal() {
    this.#renderer.hideModal();
    this.#store.setSelectedAsset(null);
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  #bindUploadEvents() {
    $(document).on('upload:complete', async (e, { succeeded, failed, resources }) => {
      this.#showToast(
        failed === 0
          ? `${succeeded} icon${succeeded !== 1 ? 's' : ''} uploaded`
          : `${succeeded} uploaded, ${failed} failed`,
        failed === 0 ? 'success' : 'error'
      );

      if (resources && resources.length > 0) {
        // Add new assets to state
        const current = this.#store.getState().assets;
        const merged  = [...resources, ...current];
        this.#store.setAssets(merged, null);

        // Persist updated index to Cloudinary
        try {
          await this.#api.saveIndex(merged);
        } catch (err) {
          console.error('Index save failed after upload:', err);
          this.#showToast('Icons uploaded but index save failed. Use Rebuild index.', 'error');
        }
      }
    });
  }

  // ── Editor ────────────────────────────────────────────────────────────────

  #bindEditorEvents() {
    $(document).on('editor:previewUpdate', (e, url) => {
      this.#renderer.updatePreview(url);
    });
  }

  // ── Tags ──────────────────────────────────────────────────────────────────

  #bindTagEvents() {
    $(document).on('tag:select', (e, tag) => {
      const { activeTag } = this.#store.getState();
      this.#store.setActiveTag(activeTag === tag ? null : tag);
    });

    $(document).on('tag:remove', async (e, tag) => {
      const { selectedAsset } = this.#store.getState();
      if (!selectedAsset) return;

      const newTags = (selectedAsset.tags || []).filter(t => t !== tag);
      this.#store.patchAsset(selectedAsset.public_id, { tags: newTags });
      this.#renderer.renderTagsEdit(newTags);
      await this.#persistIndex();
    });

    $('#btn-add-tag').on('click', () => this.#addTag());
    $('#input-new-tag').on('keydown', e => { if (e.key === 'Enter') this.#addTag(); });

    $('#btn-delete-asset').on('click', () => this.#deleteAsset());
  }

  async #addTag() {
    const { selectedAsset } = this.#store.getState();
    if (!selectedAsset) return;

    const newTag = $('#input-new-tag').val().trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!newTag) return;

    const existing = selectedAsset.tags || [];
    if (existing.includes(newTag)) { $('#input-new-tag').val(''); return; }

    const newTags = [...existing, newTag];
    this.#store.patchAsset(selectedAsset.public_id, { tags: newTags });
    this.#renderer.renderTagsEdit(newTags);
    $('#input-new-tag').val('');
    await this.#persistIndex();
  }

  async #deleteAsset() {
    const { selectedAsset } = this.#store.getState();
    if (!selectedAsset) return;

    const name = selectedAsset.public_id.split('/').pop();
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await this.#api.deleteAsset(selectedAsset.public_id);
      this.#store.removeAsset(selectedAsset.public_id);
      this.#closeModal();
      this.#showToast('Icon deleted', 'success');
      await this.#persistIndex();
    } catch (err) {
      this.#showToast(`Deletion failed: ${err.message}`, 'error');
    }
  }

  /**
   * Save current store assets to the Cloudinary index silently.
   * Shows a toast only on failure.
   */
  async #persistIndex() {
    try {
      await this.#api.saveIndex(this.#store.getState().assets);
    } catch (err) {
      console.error('Index persist failed:', err);
      this.#showToast('Index save failed. Changes are local only.', 'error');
    }
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────

  #bindKeyboard() {
    $(document).on('keydown', e => {
      if (e.key === 'Escape' && this.#store.getState().selectedAsset) this.#closeModal();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        $('#search-input').trigger('focus');
      }
    });
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  #bindLogout() {
    $('#btn-logout').on('click', () => {
      if (!confirm('Sign out and clear stored credentials?')) return;
      this.#auth.clearCredentials();
      location.reload();
    });
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  #showToast(msg, type = 'info') {
    const colors = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--text-secondary)' };
    const $t = $(`<div style="
      position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
      background:var(--bg-raised);border:1px solid var(--border-strong);
      border-left:3px solid ${colors[type]||colors.info};
      border-radius:var(--radius-sm);padding:10px 18px;
      font-size:13px;color:var(--text-primary);
      z-index:300;white-space:nowrap;
      box-shadow:0 4px 16px rgba(0,0,0,0.4);
    ">${$('<div>').text(msg).html()}</div>`);
    $('body').append($t);
    setTimeout(() => $t.fadeOut(300, () => $t.remove()), 3500);
  }
}

$(document).ready(() => new App().init());
