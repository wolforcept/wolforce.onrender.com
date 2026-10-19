'use strict';

/**
 * Uploader
 * Single responsibility: handle file intake (drag-drop, file picker)
 * and coordinate uploads through CloudinaryAPI.
 * Emits 'upload:complete' with { succeeded, failed, resources[] } on $(document).
 */
class Uploader {
  #api;
  #dragCounter = 0;

  /** @param {CloudinaryAPI} api */
  constructor(api) {
    this.#api = api;
  }

  init() {
    this.#bindDragDrop();
    this.#bindFileInput();
    this.#bindUploadButton();
  }

  // ── Drag & Drop ───────────────────────────────────────────────────────────

  #bindDragDrop() {
    const $main = $('#main');

    $main.on('dragenter', e => {
      e.preventDefault();
      this.#dragCounter++;
      if (this.#dragCounter === 1) $('#drop-overlay').removeClass('hidden');
    });

    $main.on('dragleave', () => {
      this.#dragCounter--;
      if (this.#dragCounter === 0) $('#drop-overlay').addClass('hidden');
    });

    $main.on('dragover', e => {
      e.preventDefault();
      e.originalEvent.dataTransfer.dropEffect = 'copy';
    });

    $main.on('drop', e => {
      e.preventDefault();
      this.#dragCounter = 0;
      $('#drop-overlay').addClass('hidden');
      const files = e.originalEvent.dataTransfer.files;
      if (files && files.length > 0) this.uploadFiles(files);
    });
  }

  #bindFileInput() {
    $('#file-input').on('change', e => {
      const files = e.target.files;
      if (files && files.length > 0) {
        this.uploadFiles(files);
        e.target.value = '';
      }
    });
  }

  #bindUploadButton() {
    $('#btn-upload').on('click', () => $('#file-input').trigger('click'));
  }

  // ── Upload orchestration ──────────────────────────────────────────────────

  /**
   * Upload a FileList. Shows progress panel.
   * Emits upload:complete with succeeded count, failed count, and resource objects.
   * @param {FileList|File[]} files
   */
  uploadFiles(files) {
    const fileArray = Array.from(files).filter(f => this.#isAcceptable(f));
    if (fileArray.length === 0) {
      this.#showError('No supported image files found.');
      return;
    }

    this.#showPanel();

    const promises = fileArray.map(file => this.#uploadOne(file));

    Promise.allSettled(promises).then(results => {
      const fulfilled = results.filter(r => r.status === 'fulfilled');
      const rejected  = results.filter(r => r.status === 'rejected');
      const resources = fulfilled.map(r => r.value);

      $(document).trigger('upload:complete', [{
        succeeded: fulfilled.length,
        failed:    rejected.length,
        resources,
      }]);

      if (rejected.length === 0) setTimeout(() => this.#hidePanel(), 3000);
    });
  }

  #uploadOne(file) {
    const id = `up-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.#addPanelItem(id, file.name);

    return this.#api.uploadAsset(file, [], pct => this.#updateProgress(id, pct))
      .then(resource => { this.#markDone(id); return resource; })
      .catch(err    => { this.#markError(id, err.message); throw err; });
  }

  // ── Upload panel ──────────────────────────────────────────────────────────

  #showPanel() {
    $('#upload-panel').removeClass('hidden');
    $('#btn-close-upload-panel').off('click').on('click', () => this.#hidePanel());
  }

  #hidePanel() {
    $('#upload-panel').addClass('hidden');
    $('#upload-items').empty();
  }

  #addPanelItem(id, filename) {
    const short = filename.length > 36 ? filename.slice(0, 33) + '…' : filename;
    $('#upload-items').append(`
      <div class="upload-item" id="${id}">
        <div class="upload-item-wrap">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span class="upload-item-name">${$('<div>').text(short).html()}</span>
            <span class="upload-status">0%</span>
          </div>
          <div class="upload-progress">
            <div class="upload-progress-bar" style="width:0%"></div>
          </div>
        </div>
      </div>
    `);
  }

  #updateProgress(id, pct) {
    $(`#${id} .upload-progress-bar`).css('width', `${pct}%`);
    $(`#${id} .upload-status`).text(`${pct}%`);
  }

  #markDone(id) {
    $(`#${id} .upload-progress-bar`).css('width', '100%');
    $(`#${id} .upload-status`).text('Done').addClass('done');
  }

  #markError(id, msg) {
    $(`#${id} .upload-status`).text('Failed').addClass('error');
    $(`#${id} .upload-progress-bar`).css('background', 'var(--danger)');
    $(`#${id}`).attr('title', msg);
  }

  #showError(msg) {
    this.#showPanel();
    $('#upload-items').html(`<div style="font-size:12px;color:var(--danger);padding:4px 0;">${$('<div>').text(msg).html()}</div>`);
  }

  #isAcceptable(file) {
    return /\.(svg|ico|png|jpg|jpeg|gif|webp|bmp|tiff?)$/i.test(file.name) ||
      ['image/png','image/jpeg','image/gif','image/webp','image/svg+xml',
       'image/x-icon','image/vnd.microsoft.icon','image/bmp','image/tiff'].includes(file.type);
  }
}
