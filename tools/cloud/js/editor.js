'use strict';

/**
 * ImageEditor
 * Single responsibility: manage transform control state within the modal,
 * build preview URLs via CloudinaryAPI, and trigger file downloads.
 * No store mutations, no asset listing.
 */
class ImageEditor {
  #api;
  #asset      = null;
  #aspectLock = true;
  #debounceTimer = null;

  // Current transform state
  #tf = {
    width:      '',
    height:     '',
    format:     '',
    quality:    100,
    hue:        0,
    saturation: 0,
    brightness: 0,
    contrast:   0,
    grayscale:  false,
    negate:     false,
    blackwhite: false,
    blur:       0,
    sharpen:    0,
    opacity:    100,
  };

  /** @param {CloudinaryAPI} api */
  constructor(api) {
    this.#api = api;
  }

  /**
   * Attach all editor control listeners.
   * Call once after DOM is ready.
   */
  init() {
    this.#bindDimensions();
    this.#bindSliders();
    this.#bindToggles();
    this.#bindActions();
    this.#bindTabs();
    this.#bindBgButtons();
    this.#bindCopyUrl();
  }

  /**
   * Load a new asset into the editor and reset all transforms.
   * @param {Object} asset - Cloudinary resource object
   */
  loadAsset(asset) {
    this.#asset = asset;
    this.resetTransforms();
  }

  // ── Reset ─────────────────────────────────────────────────────────────────

  resetTransforms() {
    this.#tf = {
      width: '', height: '', format: '',
      quality: 100, hue: 0, saturation: 0, brightness: 0, contrast: 0,
      grayscale: false, negate: false, blackwhite: false,
      blur: 0, sharpen: 0, opacity: 100,
    };
    this.#syncControls();
    this.#updatePreview();
  }

  /** Push #tf values back to DOM controls */
  #syncControls() {
    $('#tf-width').val(this.#tf.width);
    $('#tf-height').val(this.#tf.height);
    $('#tf-format').val(this.#tf.format);
    $('#tf-quality').val(this.#tf.quality);
    $('#tf-quality-val').text(this.#tf.quality === 100 ? 'auto' : this.#tf.quality);
    $('#tf-hue').val(this.#tf.hue);         $('#tf-hue-val').text(`${this.#tf.hue}°`);
    $('#tf-sat').val(this.#tf.saturation);  $('#tf-sat-val').text(this.#tf.saturation);
    $('#tf-bright').val(this.#tf.brightness); $('#tf-bright-val').text(this.#tf.brightness);
    $('#tf-contrast').val(this.#tf.contrast); $('#tf-contrast-val').text(this.#tf.contrast);
    $('#tf-grayscale').prop('checked', this.#tf.grayscale);
    $('#tf-negate').prop('checked', this.#tf.negate);
    $('#tf-blackwhite').prop('checked', this.#tf.blackwhite);
    $('#tf-blur').val(this.#tf.blur);       $('#tf-blur-val').text(this.#tf.blur);
    $('#tf-sharpen').val(this.#tf.sharpen); $('#tf-sharpen-val').text(this.#tf.sharpen);
    $('#tf-opacity').val(this.#tf.opacity); $('#tf-opacity-val').text(`${this.#tf.opacity}%`);
  }

  // ── Bindings ──────────────────────────────────────────────────────────────

  #bindDimensions() {
    // Aspect-ratio lock button
    $('#btn-lock-aspect').on('click', () => {
      this.#aspectLock = !this.#aspectLock;
      $('#btn-lock-aspect').toggleClass('active', this.#aspectLock);
    });

    $('#tf-width').on('input', e => {
      const w = parseInt(e.target.value, 10);
      this.#tf.width = isNaN(w) ? '' : w;

      if (this.#aspectLock && this.#tf.width && this.#asset?.width && this.#asset?.height) {
        const ratio = this.#asset.height / this.#asset.width;
        const h     = Math.round(w * ratio);
        this.#tf.height = h;
        $('#tf-height').val(h);
      }
      this.#schedulePreview();
    });

    $('#tf-height').on('input', e => {
      const h = parseInt(e.target.value, 10);
      this.#tf.height = isNaN(h) ? '' : h;

      if (this.#aspectLock && this.#tf.height && this.#asset?.width && this.#asset?.height) {
        const ratio = this.#asset.width / this.#asset.height;
        const w     = Math.round(h * ratio);
        this.#tf.width = w;
        $('#tf-width').val(w);
      }
      this.#schedulePreview();
    });

    $('#tf-format').on('change', e => {
      this.#tf.format = e.target.value;
      this.#schedulePreview();
    });
  }

  #bindSliders() {
    const sliders = [
      { id: '#tf-quality',  key: 'quality',    label: '#tf-quality-val',  fmt: v => v === 100 ? 'auto' : v },
      { id: '#tf-hue',      key: 'hue',        label: '#tf-hue-val',      fmt: v => `${v}°` },
      { id: '#tf-sat',      key: 'saturation', label: '#tf-sat-val',      fmt: v => v },
      { id: '#tf-bright',   key: 'brightness', label: '#tf-bright-val',   fmt: v => v },
      { id: '#tf-contrast', key: 'contrast',   label: '#tf-contrast-val', fmt: v => v },
      { id: '#tf-blur',     key: 'blur',       label: '#tf-blur-val',     fmt: v => v },
      { id: '#tf-sharpen',  key: 'sharpen',    label: '#tf-sharpen-val',  fmt: v => v },
      { id: '#tf-opacity',  key: 'opacity',    label: '#tf-opacity-val',  fmt: v => `${v}%` },
    ];

    sliders.forEach(({ id, key, label, fmt }) => {
      $(id).on('input', e => {
        const val       = parseInt(e.target.value, 10);
        this.#tf[key]   = val;
        $(label).text(fmt(val));
        this.#schedulePreview();
      });
    });
  }

  #bindToggles() {
    const toggles = [
      { id: '#tf-grayscale', key: 'grayscale' },
      { id: '#tf-negate',    key: 'negate' },
      { id: '#tf-blackwhite',key: 'blackwhite' },
    ];

    toggles.forEach(({ id, key }) => {
      $(id).on('change', e => {
        this.#tf[key] = e.target.checked;
        this.#schedulePreview();
      });
    });
  }

  #bindActions() {
    $('#btn-reset-transforms').on('click', () => this.resetTransforms());
    $('#btn-download').on('click', () => this.#download());
  }

  #bindTabs() {
    $('.tab-btn').on('click', function () {
      const tab = $(this).data('tab');
      $('.tab-btn').removeClass('active');
      $(this).addClass('active');
      $('.tab-content').addClass('hidden');
      $(`#tab-${tab}`).removeClass('hidden');
    });
  }

  #bindBgButtons() {
    $('.bg-btn').on('click', function () {
      const bg = $(this).data('bg');
      $('.bg-btn').removeClass('active');
      $(this).addClass('active');
      $('#preview-bg')
        .removeClass('preview-bg-checkered preview-bg-white preview-bg-black preview-bg-gray')
        .addClass(`preview-bg-${bg}`);
    });
  }

  #bindCopyUrl() {
    $('#btn-copy-url').on('click', () => {
      const url = $('#preview-url').val();
      if (!url) return;
      navigator.clipboard.writeText(url).then(() => {
        const $btn = $('#btn-copy-url');
        $btn.text('Copied!');
        setTimeout(() => $btn.text('Copy URL'), 2000);
      });
    });
  }

  // ── Preview ───────────────────────────────────────────────────────────────

  /** Debounce preview updates so sliders don't fire on every pixel */
  #schedulePreview(delay = 400) {
    clearTimeout(this.#debounceTimer);
    this.#debounceTimer = setTimeout(() => this.#updatePreview(), delay);
  }

  #updatePreview() {
    if (!this.#asset) return;
    const url = this.#buildCurrentUrl();
    $(document).trigger('editor:previewUpdate', [url]);
  }

  #buildCurrentUrl() {
    const transforms = {
      width:      this.#tf.width      || undefined,
      height:     this.#tf.height     || undefined,
      quality:    this.#tf.quality    < 100 ? this.#tf.quality : undefined,
      hue:        this.#tf.hue        !== 0 ? this.#tf.hue : undefined,
      saturation: this.#tf.saturation !== 0 ? this.#tf.saturation : undefined,
      brightness: this.#tf.brightness !== 0 ? this.#tf.brightness : undefined,
      contrast:   this.#tf.contrast   !== 0 ? this.#tf.contrast : undefined,
      grayscale:  this.#tf.grayscale  || undefined,
      negate:     this.#tf.negate     || undefined,
      blackwhite: this.#tf.blackwhite || undefined,
      blur:       this.#tf.blur       > 0 ? this.#tf.blur : undefined,
      sharpen:    this.#tf.sharpen    > 0 ? this.#tf.sharpen : undefined,
      opacity:    this.#tf.opacity    < 100 ? this.#tf.opacity : undefined,
    };

    return this.#api.buildTransformUrl(this.#asset.public_id, this.#tf.format, transforms);
  }

  // ── Download ──────────────────────────────────────────────────────────────

  async #download() {
    if (!this.#asset) return;

    const $btn = $('#btn-download');
    $btn.prop('disabled', true).text('Downloading…');

    try {
      const url      = this.#buildCurrentUrl();
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob     = await response.blob();
      const blobUrl  = URL.createObjectURL(blob);
      const name     = this.#buildFilename();

      const $a = $('<a>').attr({ href: blobUrl, download: name }).appendTo('body');
      $a[0].click();
      $a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      alert(`Download failed: ${err.message}`);
    } finally {
      $btn.prop('disabled', false).html(`
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download
      `);
    }
  }

  #buildFilename() {
    if (!this.#asset) return 'icon';
    const parts  = this.#asset.public_id.split('/');
    const base   = parts[parts.length - 1];
    const ext    = this.#tf.format || this.#asset.format || 'png';
    const suffix = this.#hasTransforms() ? '_modified' : '';
    return `${base}${suffix}.${ext}`;
  }

  #hasTransforms() {
    return (
      this.#tf.width || this.#tf.height ||
      this.#tf.format ||
      this.#tf.quality < 100 ||
      this.#tf.hue !== 0 || this.#tf.saturation !== 0 ||
      this.#tf.brightness !== 0 || this.#tf.contrast !== 0 ||
      this.#tf.grayscale || this.#tf.negate || this.#tf.blackwhite ||
      this.#tf.blur > 0 || this.#tf.sharpen > 0 ||
      this.#tf.opacity < 100
    );
  }
}
