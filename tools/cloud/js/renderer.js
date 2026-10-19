'use strict';

/**
 * Renderer
 * Single responsibility: read state from Store and write to the DOM via jQuery.
 * Emits custom jQuery events for user actions; never mutates state directly.
 */
class Renderer {
  #store;

  /** @param {Store} store */
  constructor(store) {
    this.#store = store;
  }

  // ── Auth dialog ───────────────────────────────────────────────────────────

  showAuthDialog() {
    $('#app').addClass('hidden');
    $('#auth-overlay').removeClass('hidden');
  }

  hideAuthDialog() {
    $('#auth-overlay').addClass('hidden');
    $('#app').removeClass('hidden');
  }

  showAuthError(msg) {
    $('#auth-error').text(msg).removeClass('hidden');
  }

  hideAuthError() {
    $('#auth-error').addClass('hidden');
  }

  // ── Full re-render triggered by store changes ─────────────────────────────

  /**
   * Master render: called on every store notification.
   * @param {object} state - snapshot from Store
   */
  render(state) {
    this.#renderGrid(state);
    this.#renderSidebar(state);
    this.#renderStatsBar(state);
    this.#syncViewToggle(state);
  }

  // ── Grid / list ───────────────────────────────────────────────────────────

  #renderGrid(state) {
    const $grid = $('#icon-grid');

    if (state.isLoading && state.assets.length === 0) {
      $grid.addClass('hidden');
      $('#empty-state').addClass('hidden');
      $('#loading-state').removeClass('hidden');
      return;
    }

    $('#loading-state').addClass('hidden');

    const filtered = this.#store.getFilteredAssets();

    if (filtered.length === 0) {
      $grid.addClass('hidden');
      $('#empty-state').removeClass('hidden');
      return;
    }

    $('#empty-state').addClass('hidden');
    $grid.removeClass('hidden');

    // Switch CSS class for view mode
    $grid.toggleClass('view-grid', state.view === 'grid')
         .toggleClass('view-list', state.view === 'list');

    // Efficient update: only rebuild if count or IDs changed
    $grid.empty();

    if (state.view === 'grid') {
      filtered.forEach(asset => $grid.append(this.#buildGridCard(asset)));
    } else {
      filtered.forEach(asset => $grid.append(this.#buildListRow(asset)));
    }

    // Load more button
    if (state.nextCursor) {
      $('#load-more-wrap').removeClass('hidden');
    } else {
      $('#load-more-wrap').addClass('hidden');
    }
  }

  #buildGridCard(asset) {
    const url   = this.#thumbUrl(asset);
    const name  = this.#shortName(asset.public_id);
    const meta  = `${asset.format?.toUpperCase() || '?'} · ${this.#formatBytes(asset.bytes)}`;

    const $card = $(`
      <div class="icon-card" data-public-id="${this.#esc(asset.public_id)}">
        <div class="icon-thumb">
          <img src="${this.#esc(url)}" alt="${this.#esc(name)}" loading="lazy" />
        </div>
        <div class="icon-card-info">
          <div class="icon-card-name" title="${this.#esc(asset.public_id)}">${this.#esc(name)}</div>
          <div class="icon-card-meta">${this.#esc(meta)}</div>
        </div>
      </div>
    `);

    $card.on('click', () => $(document).trigger('asset:select', [asset]));
    return $card;
  }

  #buildListRow(asset) {
    const url  = this.#thumbUrl(asset);
    const name = this.#shortName(asset.public_id);
    const date = new Date(asset.created_at).toLocaleDateString();

    const $row = $(`
      <div class="icon-row" data-public-id="${this.#esc(asset.public_id)}">
        <div class="icon-row-thumb">
          <img src="${this.#esc(url)}" alt="${this.#esc(name)}" loading="lazy" />
        </div>
        <div class="icon-row-name" title="${this.#esc(asset.public_id)}">${this.#esc(name)}</div>
        <div class="icon-row-format">${this.#esc((asset.format || '').toUpperCase())}</div>
        <div class="icon-row-size">${this.#esc(this.#formatBytes(asset.bytes))}</div>
        <div class="icon-row-date">${this.#esc(date)}</div>
      </div>
    `);

    $row.on('click', () => $(document).trigger('asset:select', [asset]));
    return $row;
  }

  // ── Sidebar ───────────────────────────────────────────────────────────────

  #renderSidebar(state) {
    // Badge
    $('#badge-all').text(state.assets.length);

    // Active nav item
    $('.nav-item').removeClass('active');
    $(`.nav-item[data-filter="${state.activeFilter}"]`).addClass('active');

    // Tags
    const tagCounts = this.#store.getTagCounts();
    const $tagList  = $('#tag-list').empty();

    Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([tag, count]) => {
        const $item = $(`
          <div class="tag-item${state.activeTag === tag ? ' active' : ''}" data-tag="${this.#esc(tag)}">
            <span class="tag-dot"></span>
            <span>${this.#esc(tag)}</span>
            <span class="tag-count">${count}</span>
          </div>
        `);
        $item.on('click', () => $(document).trigger('tag:select', [tag]));
        $tagList.append($item);
      });

    if (Object.keys(tagCounts).length === 0) {
      $tagList.append('<div style="font-size:11px;color:var(--text-muted);padding:6px 10px;">No tags yet</div>');
    }
  }

  // ── Stats bar ─────────────────────────────────────────────────────────────

  #renderStatsBar(state) {
    const filtered = this.#store.getFilteredAssets();
    const total    = state.assets.length;

    let text = `${filtered.length} icon${filtered.length !== 1 ? 's' : ''}`;
    if (filtered.length !== total) text += ` of ${total}`;

    if (state.isLoading) text = 'Loading…';

    $('#stats-text').text(text);
  }

  #syncViewToggle(state) {
    $('.view-btn').removeClass('active');
    $(`.view-btn[data-view="${state.view}"]`).addClass('active');
  }

  // ── Modal ─────────────────────────────────────────────────────────────────

  showModal(asset, rawUrl) {
    $('#modal-filename').text(this.#shortName(asset.public_id));
    $('#modal-meta').text(
      `${(asset.format || '').toUpperCase()} · ${asset.width}×${asset.height} · ${this.#formatBytes(asset.bytes)}`
    );
    $('#preview-img').attr('src', rawUrl);
    $('#preview-url').val(rawUrl);

    this.#renderInfoTab(asset);

    $('#modal-overlay').removeClass('hidden');
  }

  hideModal() {
    $('#modal-overlay').addClass('hidden');
    $('#preview-img').attr('src', '');
  }

  updatePreview(url) {
    $('#preview-img').attr('src', url);
    $('#preview-url').val(url);
  }

  #renderInfoTab(asset) {
    const $grid = $('#asset-info-grid').empty();

    const fields = [
      ['Public ID',  asset.public_id],
      ['Format',     asset.format],
      ['Dimensions', `${asset.width} × ${asset.height}`],
      ['Size',       this.#formatBytes(asset.bytes)],
      ['Created',    new Date(asset.created_at).toLocaleString()],
      ['Resource',   asset.resource_type],
    ];

    fields.forEach(([label, value]) => {
      $grid.append(`
        <div class="info-cell">
          <label>${this.#esc(label)}</label>
          <span>${this.#esc(String(value || '—'))}</span>
        </div>
      `);
    });

    this.renderTagsEdit(asset.tags || []);
  }

  renderTagsEdit(tags) {
    const $wrap = $('#asset-tags-edit').empty();
    tags.forEach(tag => {
      const $chip = $(`
        <span class="tag-chip">
          ${this.#esc(tag)}
          <button class="tag-chip-remove" data-tag="${this.#esc(tag)}" title="Remove tag">✕</button>
        </span>
      `);
      $chip.find('.tag-chip-remove').on('click', function () {
        $(document).trigger('tag:remove', [$(this).data('tag')]);
      });
      $wrap.append($chip);
    });
  }

  // ── Loading overlay ───────────────────────────────────────────────────────

  showLoading() {
    $('#loading-state').removeClass('hidden');
    $('#icon-grid').addClass('hidden');
    $('#empty-state').addClass('hidden');
  }

  hideLoading() {
    $('#loading-state').addClass('hidden');
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Build a small thumbnail URL (100px wide) */
  #thumbUrl(asset) {
    const base = `https://res.cloudinary.com`;
    // For SVG keep original; for raster add transform
    if (asset.format === 'svg') {
      return `${base}/${asset.secure_url ? '' : ''}${asset.secure_url || asset.url || ''}`;
    }
    return asset.secure_url || asset.url || '';
  }

  #shortName(publicId) {
    if (!publicId) return '—';
    const parts = publicId.split('/');
    return parts[parts.length - 1];
  }

  #formatBytes(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /** Safely escape strings for HTML attributes / text */
  #esc(str) {
    return $('<div>').text(String(str ?? '')).html();
  }
}
