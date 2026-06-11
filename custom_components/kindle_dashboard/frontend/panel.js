/**
 * Kindle Dashboard — HA Sidebar Config Panel
 * All state lives in this._config (plain JS object).
 * The DOM is a pure render of that state — never read back into config
 * except via _collectConfig(), which is only called before mutations.
 */

const FONTS = [
  { value: "Georgia, serif",           label: "Georgia" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "Arial, sans-serif",        label: "Arial" },
  { value: "Helvetica, sans-serif",    label: "Helvetica" },
  { value: "Verdana, sans-serif",      label: "Verdana" },
  { value: "Palatino, serif",          label: "Palatino" },
  { value: "Bookman, serif",           label: "Bookman" },
];

const SECTION_TYPES = [
  { value: "sensors", label: "Sensors (read-only display)" },
  { value: "toggles", label: "Toggles (lights & switches)" },
  { value: "scenes",  label: "Scenes (tap to activate)"   },
];

const ALL_DOMAINS = ["light","switch","scene","sensor","input_boolean",
                     "media_player","fan","cover","climate","lock"];

class KindleDashboardPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass     = null;
    this._config   = null;
    this._entities = [];
    this._mounted  = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) this._init();
  }
  set panel(p) {}

  async _init() {
    await Promise.all([this._loadConfig(), this._loadEntities()]);
    this._mount();
  }

  async _loadConfig() {
    try { this._config = await this._hass.callWS({ type: "kindle_dashboard/get_config" }); }
    catch(e) { this._config = {}; }
  }

  async _loadEntities() {
    try {
      const r = await this._hass.callWS({ type: "kindle_dashboard/get_entities", domains: ALL_DOMAINS });
      this._entities = r.entities || [];
    } catch(e) { this._entities = []; }
  }

  // ── MOUNT: build static chrome once, wire listeners once ───────────────

  _mount() {
    this.shadowRoot.innerHTML = `<style>${this._css()}</style>
      <div class="top-bar">
        <h1>📱 Kindle Dashboard</h1>
        <span id="topbar-link"></span>
      </div>
      <div class="save-bar" id="save-bar">
        <span>Unsaved changes</span>
        <button id="discard-btn">Discard</button>
        <button class="primary" id="save-btn">Save</button>
      </div>
      <div class="content">

        <div class="card" id="card-url">
          <div class="card-header"><span class="icon">🔗</span> Kindle URL</div>
          <div class="card-body">
            <p class="hint">Generate a Long-Lived Access Token in your HA profile, paste it below, then bookmark the URL on your Kindle.</p>
            <div class="form-row">
              <label>Long-Lived Access Token</label>
              <input type="text" id="kindle-token" placeholder="Paste token here…"
                     style="font-family:monospace;font-size:12px">
            </div>
            <div class="form-row">
              <label>Kindle Bookmark URL</label>
              <div class="kindle-url" id="token-url-display"></div>
            </div>
          </div>
        </div>

        <div class="card" id="card-general">
          <div class="card-header"><span class="icon">⚙️</span> General</div>
          <div class="card-body">
            <div class="form-row two-col">
              <div>
                <label>Location Name</label>
                <input type="text" id="location-name" placeholder="Home">
              </div>
              <div>
                <label>Page width</label>
                <div class="num-row">
                  <input type="number" id="page-width" min="320" max="1920" step="10">
                  <span class="num-unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row two-col">
              <div>
                <label>Font</label>
                <select id="font-select"></select>
              </div>
              <div>
                <label>Sensor Units</label>
                <label class="opt-row">
                  <input type="checkbox" id="inline-units">
                  <span>Inline <em>(22 °F)</em></span>
                </label>
              </div>
            </div>
            <div class="form-row three-col">
              <div>
                <label>Label font size</label>
                <div class="num-row">
                  <input type="number" id="label-font-size" min="6" max="32" step="1">
                  <span class="num-unit">px</span>
                </div>
              </div>
              <div>
                <label>ID / Unit font size</label>
                <div class="num-row">
                  <input type="number" id="sub-font-size" min="6" max="24" step="1">
                  <span class="num-unit">px</span>
                </div>
              </div>
              <div>
                <label>Value font size</label>
                <div class="num-row">
                  <input type="number" id="value-font-size" min="8" max="48" step="1">
                  <span class="num-unit">px</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="icon">📋</span> Sections
            <span class="hint-inline">top-to-bottom on the Kindle</span>
          </div>
          <div class="card-body">
            <div id="sections-root"></div>
            <div class="add-section-row">
              <select id="new-section-type">
                ${SECTION_TYPES.map(t => `<option value="${t.value}">${t.label}</option>`).join("")}
              </select>
              <button id="btn-add-section" class="add-btn">+ Add Section</button>
            </div>
          </div>
        </div>

      </div>
      <div id="toast"></div>`;

    this._wireListeners();
    this._mounted = true;
    this._syncToDOM();
  }

  // ── SYNC: push this._config into the DOM (no DOM reads) ────────────────

  _syncToDOM() {
    if (!this._mounted) return;
    const cfg  = this._config || {};
    const root = this.shadowRoot;

    // Token & URL
    const token    = cfg.kindle_token || "";
    const tokenUrl = token
      ? `${window.location.origin}/api/kindle_dashboard/kindle?token=${encodeURIComponent(token)}`
      : "";
    root.querySelector("#kindle-token").value = token;
    const urlEl = root.querySelector("#token-url-display");
    urlEl.innerHTML = tokenUrl
      ? `<a href="${this._esc(tokenUrl)}" target="_blank">${this._esc(tokenUrl)}</a>`
      : `<span class="muted">Paste a token above and save to generate the URL</span>`;
    const topLink = root.querySelector("#topbar-link");
    topLink.innerHTML = tokenUrl
      ? `<a href="${this._esc(tokenUrl)}" target="_blank">Open Kindle View ↗</a>` : "";

    // General
    root.querySelector("#location-name").value      = cfg.location_name || "Home";
    root.querySelector("#inline-units").checked     = !!cfg.inline_units;
    root.querySelector("#page-width").value         = cfg.page_width ?? 600;
    root.querySelector("#label-font-size").value    = cfg.label_font_size  ?? 13;
    root.querySelector("#sub-font-size").value      = cfg.sub_font_size    ?? 10;
    root.querySelector("#value-font-size").value    = cfg.value_font_size  ?? 18;


    // Font select — build options with per-option font styling
    const fontSel  = root.querySelector("#font-select");
    const curFont  = cfg.font || "Georgia, serif";
    fontSel.innerHTML = FONTS.map(f =>
      `<option value="${this._esc(f.value)}"
         style="font-family:${this._esc(f.value)}"
         ${f.value === curFont ? "selected" : ""}>${f.label}</option>`
    ).join("");
    // Apply preview font to the select element itself
    fontSel.style.fontFamily = curFont;

    // Sections
    root.querySelector("#sections-root").innerHTML =
      (cfg.sections || []).map((sec, si) => this._sectionHTML(sec, si)).join("");
  }

  // ── SECTION HTML ────────────────────────────────────────────────────────

  _sectionHTML(sec, si) {
    const addLabel = {sensors:"+ Add Sensor", scenes:"+ Add Scene"}[sec.type] || "+ Add Toggle";
    const twoCol   = !!sec.two_columns;
    const items    = sec.items || [];
    return `
      <div class="section-card">
        <div class="sec-header">
          <span class="sec-badge">${sec.type}</span>
          <input class="sec-name" type="text" placeholder="Section name" value="${this._esc(sec.label||"")}">
          ${(sec.type === "toggles" || sec.type === "scenes")
            ? `<label class="two-col-wrap" title="Two-column layout on Kindle">
                 <input type="checkbox" class="sec-twocol"${twoCol?" checked":""}> 2 columns
               </label>` : ""}
          <label class="two-col-wrap" title="Hide entity IDs in this section">
            <input type="checkbox" class="sec-hideids"${sec.hide_entity_ids?" checked":""}> hide IDs
          </label>
          <div class="sec-actions">
            <button class="btn-move-sec" data-dir="-1">↑</button>
            <button class="btn-move-sec" data-dir="1">↓</button>
            <button class="btn-del-sec">🗑</button>
          </div>
        </div>
        <div class="sec-items${twoCol?" two-col-items":""}">
          ${items.map((item, ii) => this._itemHTML(sec.type, item, si, ii)).join("")}
        </div>
        <button class="btn-add-item add-item-btn">${addLabel}</button>
      </div>`;
  }

  _itemHTML(sectype, item, si, ii) {
    // Move + delete buttons shared by all types
    const ctrl = `
      <button class="btn-move-item" data-dir="-1" title="Move up">↑</button>
      <button class="btn-move-item" data-dir="1"  title="Move down">↓</button>
      <button class="btn-del-item" title="Remove">✕</button>`;

    if (sectype === "sensors") {
      const opts = this._entities.filter(e => e.domain === "sensor")
        .map(e => `<option value="${e.entity_id}"${e.entity_id===item.id?" selected":""}>${e.name} (${e.entity_id})</option>`)
        .join("");
      return `<div class="item-row" data-ii="${ii}">
        <select class="i-entity i-wide"><option value="">— pick sensor —</option>${opts}</select>
        <input class="i-label i-mid" type="text" placeholder="Label" value="${this._esc(item.label||"")}">
        <input class="i-unit" type="text" placeholder="Unit" value="${this._esc(item.unit||"")}">
        ${ctrl}</div>`;
    }

    if (sectype === "scenes") {
      const opts = this._entities.filter(e => e.domain === "scene")
        .map(e => `<option value="${e.entity_id}"${e.entity_id===(item.entity||"")?" selected":""}>${e.name} (${e.entity_id})</option>`)
        .join("");
      return `<div class="item-row" data-ii="${ii}">
        <input class="i-icon" type="text" placeholder="🎭" value="${this._esc(item.icon||"")}">
        <select class="i-entity i-wide"><option value="">— pick scene —</option>${opts}</select>
        <input class="i-label i-mid" type="text" placeholder="Name" value="${this._esc(item.name||"")}">
        ${ctrl}</div>`;
    }

    // toggles — entity first, then label
    const opts = this._entities
      .filter(e => ["light","switch","input_boolean","fan","cover","lock","media_player"].includes(e.domain))
      .map(e => `<option value="${e.entity_id}"${e.entity_id===item.id?" selected":""}>${e.name} (${e.entity_id})</option>`)
      .join("");
    return `<div class="item-row" data-ii="${ii}">
      <input class="i-icon" type="text" placeholder="💡" value="${this._esc(item.icon||"")}">
      <select class="i-entity i-wide"><option value="">— pick entity —</option>${opts}</select>
      <input class="i-label i-mid" type="text" placeholder="Label" value="${this._esc(item.label||"")}">
      <label class="hide-wrap" title="Exclude from light status strip">
        <input type="checkbox" class="i-hide"${item.hide_from_status?" checked":""}> hide
      </label>
      ${ctrl}</div>`;
  }

  // ── LISTENERS — wired once in _mount ────────────────────────────────────

  _wireListeners() {
    const root = this.shadowRoot;

    // Any input/change → mark dirty; font select also updates preview
    root.addEventListener("input",  () => this._markDirty());
    root.addEventListener("change", (e) => {
      this._markDirty();
      if (e.target.id === "font-select") {
        if (!this._config) this._config = {};
        this._config.font = e.target.value;
        e.target.style.fontFamily = e.target.value;
      }
    });

    // Delegated click handler
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      if (btn.id === "btn-add-section") { this._doAddSection();  return; }
      if (btn.id === "save-btn")        { this._doSave();        return; }
      if (btn.id === "discard-btn")     { this._config = null; this._init(); return; }

      const card = btn.closest(".section-card");
      if (!card) return;
      const allCards = [...root.querySelectorAll(".section-card")];
      const si = allCards.indexOf(card);
      if (si === -1) return;

      if (btn.classList.contains("btn-add-item"))  { this._doAddItem(si);    return; }
      if (btn.classList.contains("btn-del-sec"))   { this._doDelSection(si); return; }
      if (btn.classList.contains("btn-move-sec"))  { this._doMoveSection(si, parseInt(btn.dataset.dir)); return; }

      const row = btn.closest(".item-row");
      if (!row) return;
      const ii = [...card.querySelectorAll(".item-row")].indexOf(row);
      if (ii === -1) return;

      if (btn.classList.contains("btn-del-item"))  { this._doDelItem(si, ii);                            return; }
      if (btn.classList.contains("btn-move-item")) { this._doMoveItem(si, ii, parseInt(btn.dataset.dir)); return; }
    });
  }

  _markDirty() {
    this.shadowRoot.querySelector("#save-bar")?.classList.add("visible");
  }

  // ── COLLECT: read current DOM state into a plain config object ──────────
  // This is the ONLY place we read from the DOM back into data.

  _collectConfig() {
    const root = this.shadowRoot;
    const cfg  = Object.assign({}, this._config || {});

    cfg.location_name    = root.querySelector("#location-name")?.value.trim() || "Home";
    cfg.kindle_token     = root.querySelector("#kindle-token")?.value.trim()  || "";
    cfg.font             = root.querySelector("#font-select")?.value           || "Georgia, serif";
    cfg.inline_units     = root.querySelector("#inline-units")?.checked        || false;
    cfg.page_width       = parseInt(root.querySelector("#page-width")?.value)  || 600;
    cfg.label_font_size  = parseInt(root.querySelector("#label-font-size")?.value)  || 13;
    cfg.sub_font_size    = parseInt(root.querySelector("#sub-font-size")?.value)    || 10;
    cfg.value_font_size  = parseInt(root.querySelector("#value-font-size")?.value)  || 18;


    cfg.sections = [...root.querySelectorAll(".section-card")].map(card => {
      const sectype   = card.querySelector(".sec-badge")?.textContent?.trim() || "toggles";
      const label        = card.querySelector(".sec-name")?.value.trim()  || "";
      const two_col      = card.querySelector(".sec-twocol")?.checked       || false;
      const hide_ids     = card.querySelector(".sec-hideids")?.checked      || false;

      const items = [...card.querySelectorAll(".item-row")].map(row => {
        const entity = row.querySelector(".i-entity")?.value || "";
        const lbl    = row.querySelector(".i-label")?.value.trim() || "";
        const icon   = row.querySelector(".i-icon")?.value.trim()  || "";
        const unit   = row.querySelector(".i-unit")?.value.trim()  || "";
        const hide   = row.querySelector(".i-hide")?.checked       || false;

        if (sectype === "sensors") return { id: entity, label: lbl, unit, hide_from_status: hide };
        if (sectype === "scenes")  return { icon, name: lbl, desc: "", entity };
        return { id: entity, icon, label: lbl, hide_from_status: hide };
      });

      return { type: sectype, label, two_columns: two_col, hide_entity_ids: hide_ids, items };
    });

    return cfg;
  }

  // ── MUTATIONS ────────────────────────────────────────────────────────────
  // Pattern: collect → mutate cfg → store as this._config → syncToDOM

  _doAddSection() {
    const cfg  = this._collectConfig();
    const type = this.shadowRoot.querySelector("#new-section-type")?.value || "toggles";
    cfg.sections.push({ type, label: "", two_columns: false, items: [] });
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doDelSection(si) {
    const cfg = this._collectConfig();
    cfg.sections.splice(si, 1);
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doMoveSection(si, dir) {
    const cfg = this._collectConfig();
    const to  = si + dir;
    if (to < 0 || to >= cfg.sections.length) return;
    [cfg.sections[si], cfg.sections[to]] = [cfg.sections[to], cfg.sections[si]];
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doAddItem(si) {
    const cfg = this._collectConfig();
    const sec = cfg.sections[si];
    if (!sec) return;
    if (sec.type === "sensors")
      sec.items.push({ id: "", label: "", unit: "", hide_from_status: false });
    else if (sec.type === "scenes")
      sec.items.push({ icon: "🎭", name: "", desc: "", entity: "" });
    else
      sec.items.push({ id: "", icon: "💡", label: "", hide_from_status: false });
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doDelItem(si, ii) {
    const cfg = this._collectConfig();
    cfg.sections[si]?.items.splice(ii, 1);
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doMoveItem(si, ii, dir) {
    const cfg   = this._collectConfig();
    const items = cfg.sections[si]?.items;
    if (!items) return;
    const to = ii + dir;
    if (to < 0 || to >= items.length) return;
    [items[ii], items[to]] = [items[to], items[ii]];
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  // Only repaint the sections list — general fields stay untouched
  _paintSections() {
    const root = this.shadowRoot;
    root.querySelector("#sections-root").innerHTML =
      (this._config?.sections || []).map((sec, si) => this._sectionHTML(sec, si)).join("");
  }

  // ── SAVE ────────────────────────────────────────────────────────────────

  async _doSave() {
    const cfg = this._collectConfig();
    // Strip items with no entity before persisting
    cfg.sections.forEach(sec => {
      sec.items = sec.items.filter(item =>
        sec.type === "scenes" ? !!item.entity : !!item.id
      );
    });
    try {
      await this._hass.callWS({ type: "kindle_dashboard/save_config", config: cfg });
      this._config = cfg;
      this.shadowRoot.querySelector("#save-bar")?.classList.remove("visible");
      this._toast("✓ Saved — reload Kindle page to apply");
      this._paintSections(); // reflect any filtering
    } catch(e) { this._toast("Error saving: " + e.message); }
  }

  // ── CSS ──────────────────────────────────────────────────────────────────

  _css() { return `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :host{display:block;min-height:100%;background:var(--primary-background-color,#fafafa);
      color:var(--primary-text-color,#212121);
      font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif);font-size:14px}
    .top-bar{background:var(--app-header-background-color,var(--primary-color,#03a9f4));
      color:var(--app-header-text-color,#fff);padding:0 16px;height:56px;
      display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:10;
      box-shadow:0 2px 4px rgba(0,0,0,.18)}
    .top-bar h1{font-size:20px;font-weight:500;flex:1}
    .top-bar a{color:inherit;font-size:13px;opacity:.85;text-decoration:none;
      border:1px solid rgba(255,255,255,.5);padding:4px 10px;border-radius:4px;white-space:nowrap}
    .save-bar{display:none;position:sticky;top:56px;z-index:9;
      background:var(--warning-color,#ff9800);color:#fff;
      padding:8px 16px;align-items:center;gap:10px;font-size:13px}
    .save-bar.visible{display:flex}
    .save-bar span{flex:1}
    .save-bar button{background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.5);
      color:#fff;padding:5px 14px;border-radius:4px;cursor:pointer;font-size:13px}
    .save-bar button.primary{background:rgba(0,0,0,.18);font-weight:600}
    .content{padding:16px;max-width:860px;margin:0 auto}
    .card{background:var(--card-background-color,#fff);border-radius:8px;
      box-shadow:0 1px 3px rgba(0,0,0,.12);margin-bottom:16px;overflow:hidden}
    .card-header{padding:13px 16px 10px;font-size:16px;font-weight:500;
      border-bottom:1px solid var(--divider-color,#e0e0e0);display:flex;align-items:center;gap:8px}
    .card-header .icon{font-size:18px}
    .hint-inline{font-size:12px;color:var(--secondary-text-color,#888);font-weight:400}
    .card-body{padding:12px 16px 16px}
    .hint{font-size:13px;color:var(--secondary-text-color,#888);margin-bottom:10px}
    .form-row{margin-bottom:12px}
    .form-row:last-child{margin-bottom:0}
    .form-row.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    label{display:block;font-size:11px;font-weight:500;
      color:var(--secondary-text-color,#727272);margin-bottom:4px;
      letter-spacing:.04em;text-transform:uppercase}
    input[type=text],select{width:100%;padding:7px 9px;
      border:1px solid var(--divider-color,#ccc);border-radius:4px;
      background:var(--primary-background-color,#fff);
      color:var(--primary-text-color,#212121);font-size:13px}
    input[type=text]:focus,select:focus{outline:none;border-color:var(--primary-color,#03a9f4)}
    /* Inside item rows: reset width:100% so flex sizing works */
    .item-row input[type=text],.item-row select{width:auto;padding:4px 6px;font-size:12px}
    /* general card option rows */
    .opt-row{display:flex;align-items:center;gap:7px;cursor:pointer;
      font-size:13px;text-transform:none;letter-spacing:0;font-weight:400;
      color:var(--primary-text-color,#212121);margin-top:6px;margin-bottom:0}
    .opt-row input[type=checkbox]{width:15px;height:15px;flex-shrink:0;margin:0}
    .opt-row em{font-style:normal;color:var(--secondary-text-color,#888);font-size:12px}
    .form-row.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .num-row{display:flex;align-items:center;gap:4px}
    .num-row input[type=number]{width:64px;padding:7px 8px;
      border:1px solid var(--divider-color,#ccc);border-radius:4px;
      background:var(--primary-background-color,#fff);
      color:var(--primary-text-color,#212121);font-size:13px;text-align:center}
    .num-row input[type=number]:focus{outline:none;border-color:var(--primary-color,#03a9f4)}
    .num-unit{font-size:13px;color:var(--secondary-text-color,#888)}
    /* sections */
    #sections-root{display:flex;flex-direction:column;gap:12px;margin-bottom:12px}
    .section-card{border:1px solid var(--divider-color,#ddd);border-radius:6px;overflow:hidden}
    .sec-header{display:flex;align-items:center;gap:8px;
      background:var(--secondary-background-color,#f5f5f5);
      padding:8px 10px;border-bottom:1px solid var(--divider-color,#ddd)}
    .sec-badge{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
      background:var(--primary-color,#03a9f4);color:#fff;
      padding:2px 7px;border-radius:10px;flex-shrink:0}
    .sec-name{flex:1;padding:5px 8px;font-size:14px;font-weight:500;
      border:1px solid transparent;border-radius:4px;
      background:transparent;color:var(--primary-text-color)}
    .sec-name:focus{border-color:var(--primary-color,#03a9f4);
      background:var(--primary-background-color,#fff)}
    .two-col-wrap{display:flex;align-items:center;gap:4px;font-size:12px;
      white-space:nowrap;cursor:pointer;color:var(--secondary-text-color,#666);
      text-transform:none;letter-spacing:0;font-weight:400;margin-bottom:0;flex-shrink:0}
    .two-col-wrap input{width:13px;height:13px;margin:0}
    .sec-actions{display:flex;gap:4px;flex-shrink:0}
    .btn-move-sec,.btn-del-sec{background:none;border:1px solid var(--divider-color,#ccc);
      border-radius:4px;padding:3px 7px;cursor:pointer;font-size:13px;
      color:var(--primary-text-color)}
    .btn-del-sec{color:var(--error-color,#db4437)}
    /* items */
    .sec-items{display:flex;flex-direction:column;gap:6px;padding:8px 10px}
    .sec-items.two-col-items{display:grid;grid-template-columns:1fr 1fr;gap:6px}
    .item-row{display:flex;align-items:center;gap:5px;flex-wrap:nowrap;
      background:var(--primary-background-color,#fff);
      border:1px solid var(--divider-color,#e0e0e0);border-radius:4px;padding:5px 7px}
    /* item-row input sizing handled above */
    .i-icon{width:36px!important;flex-shrink:0;text-align:center}
    .i-wide{flex:2 1 120px;min-width:80px}
    .i-mid{flex:1 1 80px;min-width:60px}
    .i-unit{width:50px!important;flex-shrink:0}
    .hide-wrap{display:flex;align-items:center;gap:3px;font-size:11px;
      color:var(--secondary-text-color);white-space:nowrap;cursor:pointer;
      text-transform:none;letter-spacing:0;font-weight:400;margin-bottom:0;flex-shrink:0}
    .hide-wrap input{width:13px;height:13px;margin:0}
    .btn-move-item,.btn-del-item{background:none;border:none;cursor:pointer;
      padding:2px 4px;border-radius:3px;font-size:12px;flex-shrink:0;
      color:var(--secondary-text-color,#888)}
    .btn-del-item{color:var(--error-color,#db4437);font-size:14px}
    .btn-move-item:hover{background:var(--secondary-background-color,#eee)}
    .btn-del-item:hover{background:rgba(219,68,55,.1)}
    .add-item-btn{display:block;width:calc(100% - 20px);margin:0 10px 10px;
      background:none;border:1px dashed var(--primary-color,#03a9f4);
      color:var(--primary-color,#03a9f4);padding:6px 14px;
      border-radius:4px;cursor:pointer;font-size:12px}
    .add-section-row{display:flex;gap:8px;align-items:center}
    .add-section-row select{flex:1}
    .add-btn{background:none;border:1px solid var(--primary-color,#03a9f4);
      color:var(--primary-color,#03a9f4);padding:7px 14px;border-radius:4px;
      cursor:pointer;font-size:13px;white-space:nowrap}
    .kindle-url{font-family:monospace;background:var(--secondary-background-color,#f5f5f5);
      padding:8px 12px;border-radius:4px;font-size:12px;word-break:break-all;
      border:1px solid var(--divider-color,#ddd);min-height:34px}
    .kindle-url a{color:var(--primary-color,#03a9f4)}
    .muted{color:var(--secondary-text-color,#999)}
    #toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
      background:#323232;color:#fff;padding:10px 22px;border-radius:4px;
      font-size:13px;display:none;z-index:999;white-space:nowrap}
  `; }

  _esc(s) {
    return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;")
      .replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  _toast(msg) {
    const el = this.shadowRoot.querySelector("#toast");
    if (!el) return;
    el.textContent = msg; el.style.display = "block";
    clearTimeout(this._tt);
    this._tt = setTimeout(() => { el.style.display = "none"; }, 3000);
  }
}

customElements.define("kindle-dashboard-panel", KindleDashboardPanel);
