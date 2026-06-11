/**
 * Kindle Dashboard — HA Sidebar Config Panel
 */

const SECTION_TYPES = [
  { value: "sensors", label: "Sensors (read-only display)" },
  { value: "toggles", label: "Toggles (lights & switches)" },
  { value: "scenes",  label: "Scenes (tap to activate)"   },
];

const FONTS = [
  { value: "Georgia, serif",              label: "Georgia (default)" },
  { value: "'Courier New', monospace",    label: "Courier New"       },
  { value: "'Times New Roman', serif",    label: "Times New Roman"   },
  { value: "Arial, sans-serif",           label: "Arial"             },
  { value: "Helvetica, sans-serif",       label: "Helvetica"         },
  { value: "Verdana, sans-serif",         label: "Verdana"           },
  { value: "Palatino, serif",             label: "Palatino"          },
  { value: "Bookman, serif",              label: "Bookman"           },
];

const ALL_DOMAINS = ["light", "switch", "scene", "sensor", "input_boolean",
                     "media_player", "fan", "cover", "climate", "lock"];

class KindleDashboardPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass    = null;
    this._config  = null;
    this._entities = [];
    this._dirty   = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) this._init();
  }

  set panel(p) { this._panelConfig = p.config; }

  async _init() {
    await Promise.all([this._loadConfig(), this._loadEntities()]);
    this._render();
  }

  async _loadConfig() {
    try { this._config = await this._hass.callWS({ type: "kindle_dashboard/get_config" }); }
    catch(e) { this._config = {}; }
  }

  async _loadEntities() {
    try {
      const res = await this._hass.callWS({
        type: "kindle_dashboard/get_entities",
        domains: ALL_DOMAINS,
      });
      this._entities = res.entities || [];
    } catch(e) { this._entities = []; }
  }

  // ── RENDER ──────────────────────────────────────────────────────────────

  _render() {
    const cfg         = this._config || {};
    const location    = cfg.location_name || "Home";
    const sections    = cfg.sections || [];
    const font        = cfg.font || "Georgia, serif";
    const inlineUnits = cfg.inline_units === true;
    const token       = cfg.kindle_token || "";
    const tokenUrl    = token
      ? `${window.location.origin}/api/kindle_dashboard/kindle?token=${encodeURIComponent(token)}`
      : "";

    this.shadowRoot.innerHTML = `<style>${this._css()}</style>` + `
      <div class="top-bar">
        <h1>📱 Kindle Dashboard</h1>
        ${tokenUrl ? `<a href="${this._esc(tokenUrl)}" target="_blank">Open Kindle View ↗</a>` : ""}
      </div>
      <div class="save-bar" id="save-bar">
        <span>Unsaved changes</span>
        <button id="discard-btn">Discard</button>
        <button class="primary" id="save-btn">Save</button>
      </div>
      <div class="content">

        <!-- KINDLE URL -->
        <div class="card">
          <div class="card-header"><span class="icon">🔗</span> Kindle URL</div>
          <div class="card-body">
            <p class="hint">Generate a Long-Lived Access Token in your HA profile, paste it below, then bookmark the URL on your Kindle.</p>
            <div class="form-row">
              <label>Long-Lived Access Token</label>
              <input type="text" id="kindle-token" placeholder="Paste token here…"
                     value="${this._esc(token)}" style="font-family:monospace;font-size:12px">
            </div>
            <div class="form-row">
              <label>Kindle Bookmark URL</label>
              <div class="kindle-url">
                ${tokenUrl
                  ? `<a href="${this._esc(tokenUrl)}" target="_blank">${this._esc(tokenUrl)}</a>`
                  : `<span class="muted">Paste a token above and save to generate the URL</span>`}
              </div>
            </div>
          </div>
        </div>

        <!-- GENERAL -->
        <div class="card">
          <div class="card-header"><span class="icon">⚙️</span> General</div>
          <div class="card-body">
            <div class="form-row">
              <label>Location Name</label>
              <input type="text" id="location-name" value="${this._esc(location)}" placeholder="Home">
            </div>
            <div class="form-row two-col">
              <div>
                <label>Font</label>
                <select id="font-select">
                  ${FONTS.map(f => `<option value="${this._esc(f.value)}" ${f.value === font ? "selected" : ""}
                    style="font-family:${this._esc(f.value)}">${f.label}</option>`).join("")}
                </select>
              </div>
              <div>
                <label>Sensor units</label>
                <div class="form-row-inline" style="margin-top:6px">
                  <label class="ha-switch" for="inline-units">
                    <input type="checkbox" id="inline-units" ${inlineUnits ? "checked" : ""}>
                    <span class="ha-slider"></span>
                  </label>
                  <span class="switch-label" id="inline-units-label">
                    ${inlineUnits ? "Inline (22° C)" : "Stacked (value then unit)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTIONS -->
        <div class="card">
          <div class="card-header">
            <span class="icon">📋</span> Sections
            <span class="hint-inline">displayed top-to-bottom on the Kindle</span>
          </div>
          <div class="card-body">
            <div id="sections-list">
              ${sections.map((s, i) => this._sectionCard(s, i)).join("")}
            </div>
            <div class="add-section-row">
              <select id="new-section-type">
                ${SECTION_TYPES.map(t => `<option value="${t.value}">${t.label}</option>`).join("")}
              </select>
              <button class="add-btn" id="add-section-btn">+ Add Section</button>
            </div>
          </div>
        </div>

      </div>
      <div id="toast"></div>
    `;

    this._attachListeners();
  }

  // ── SECTION CARD ─────────────────────────────────────────────────────────

  _sectionCard(sec, si) {
    const typeLabel = SECTION_TYPES.find(t => t.value === sec.type)?.label || sec.type;
    const items = sec.items || [];

    const itemsHtml = items.map((item, ii) => this._itemRow(sec.type, item, si, ii)).join("");

    const addLabel = sec.type === "sensors" ? "+ Add Sensor"
                   : sec.type === "scenes"  ? "+ Add Scene"
                   :                          "+ Add Toggle";

    return `
      <div class="section-card" data-si="${si}" data-sectype="${sec.type}">
        <div class="section-card-header">
          <span class="sec-type-badge">${sec.type}</span>
          <input class="sec-name-input" type="text" placeholder="Section name"
                 value="${this._esc(sec.label || "")}" data-si="${si}">
          <div class="sec-header-actions">
            <button class="move-btn" data-si="${si}" data-dir="-1" title="Move up">↑</button>
            <button class="move-btn" data-si="${si}" data-dir="1"  title="Move down">↓</button>
            <button class="del-section-btn" data-si="${si}" title="Remove section">🗑</button>
          </div>
        </div>
        <div class="section-items" id="sec-items-${si}">
          ${itemsHtml}
        </div>
        <button class="add-item-btn" data-si="${si}" data-type="${sec.type}">${addLabel}</button>
      </div>`;
  }

  _itemRow(type, item, si, ii) {
    if (type === "sensors") return this._sensorItemRow(item, si, ii);
    if (type === "scenes")  return this._sceneItemRow(item, si, ii);
    return this._toggleItemRow(item, si, ii);
  }

  _sensorItemRow(item, si, ii) {
    const ents = this._entities.filter(e => e.domain === "sensor");
    const opts = ents.map(e =>
      `<option value="${e.entity_id}" ${e.entity_id === item.id ? "selected" : ""}>${e.name} (${e.entity_id})</option>`
    ).join("");
    return `
      <div class="item-row sensor-row" data-si="${si}" data-ii="${ii}" data-type="sensor">
        <select class="i-entity" data-si="${si}" data-ii="${ii}">
          <option value="">— pick sensor —</option>${opts}
        </select>
        <input class="i-label" type="text" placeholder="Label"
               value="${this._esc(item.label || "")}" data-si="${si}" data-ii="${ii}">
        <input class="i-unit" type="text" placeholder="Unit" style="width:56px"
               value="${this._esc(item.unit || "")}" data-si="${si}" data-ii="${ii}">
        <div class="hide-wrap" title="Exclude from light status strip">
          <input type="checkbox" class="i-hide" data-si="${si}" data-ii="${ii}"
                 ${item.hide_from_status ? "checked" : ""}>
          <span>Hide<br>status</span>
        </div>
        <button class="del-item-btn" data-si="${si}" data-ii="${ii}">✕</button>
      </div>`;
  }

  _sceneItemRow(item, si, ii) {
    const ents = this._entities.filter(e => e.domain === "scene");
    const opts = ents.map(e =>
      `<option value="${e.entity_id}" ${e.entity_id === (item.entity || item.id) ? "selected" : ""}>${e.name} (${e.entity_id})</option>`
    ).join("");
    return `
      <div class="item-row scene-row" data-si="${si}" data-ii="${ii}" data-type="scene">
        <input class="i-icon" type="text" placeholder="🎭" style="width:40px;text-align:center"
               value="${this._esc(item.icon || "")}" data-si="${si}" data-ii="${ii}">
        <input class="i-label" type="text" placeholder="Name"
               value="${this._esc(item.name || "")}" data-si="${si}" data-ii="${ii}">
        <select class="i-entity" data-si="${si}" data-ii="${ii}">
          <option value="">— pick scene —</option>${opts}
        </select>
        <button class="del-item-btn" data-si="${si}" data-ii="${ii}">✕</button>
      </div>`;
  }

  _toggleItemRow(item, si, ii) {
    const ents = this._entities.filter(e =>
      ["light","switch","input_boolean","fan","cover","lock","media_player"].includes(e.domain)
    );
    const opts = ents.map(e =>
      `<option value="${e.entity_id}" ${e.entity_id === item.id ? "selected" : ""}>${e.name} (${e.entity_id})</option>`
    ).join("");
    return `
      <div class="item-row toggle-row" data-si="${si}" data-ii="${ii}" data-type="toggle">
        <input class="i-icon" type="text" placeholder="💡" style="width:40px;text-align:center"
               value="${this._esc(item.icon || "")}" data-si="${si}" data-ii="${ii}">
        <input class="i-label" type="text" placeholder="Label"
               value="${this._esc(item.label || "")}" data-si="${si}" data-ii="${ii}">
        <select class="i-entity" data-si="${si}" data-ii="${ii}">
          <option value="">— pick entity —</option>${opts}
        </select>
        <div class="hide-wrap" title="Exclude from light status strip">
          <input type="checkbox" class="i-hide" data-si="${si}" data-ii="${ii}"
                 ${item.hide_from_status ? "checked" : ""}>
          <span>Hide<br>status</span>
        </div>
        <button class="del-item-btn" data-si="${si}" data-ii="${ii}">✕</button>
      </div>`;
  }

  // ── LISTENERS ────────────────────────────────────────────────────────────

  _attachListeners() {
    const root = this.shadowRoot;

    root.addEventListener("change", () => this._markDirty());
    root.addEventListener("input",  () => this._markDirty());

    // Live font preview in panel
    root.querySelector("#font-select")?.addEventListener("change", (e) => {
      if (!this._config) this._config = {};
      this._config.font = e.target.value;
    });

    // Inline-units label update
    root.querySelector("#inline-units")?.addEventListener("change", (e) => {
      root.querySelector("#inline-units-label").textContent =
        e.target.checked ? "Inline (22° C)" : "Stacked (value then unit)";
    });

    root.addEventListener("click", (e) => {
      const addSection = e.target.closest("#add-section-btn");
      if (addSection) { this._addSection(); return; }

      const addItem = e.target.closest(".add-item-btn");
      if (addItem) { this._addItem(parseInt(addItem.dataset.si), addItem.dataset.type); return; }

      const delSection = e.target.closest(".del-section-btn");
      if (delSection) { this._deleteSection(parseInt(delSection.dataset.si)); return; }

      const delItem = e.target.closest(".del-item-btn");
      if (delItem) { this._deleteItem(parseInt(delItem.dataset.si), parseInt(delItem.dataset.ii)); return; }

      const move = e.target.closest(".move-btn");
      if (move) { this._moveSection(parseInt(move.dataset.si), parseInt(move.dataset.dir)); return; }
    });

    root.querySelector("#save-btn")   ?.addEventListener("click", () => this._save());
    root.querySelector("#discard-btn")?.addEventListener("click", () => { this._config = null; this._init(); });
  }

  _markDirty() {
    this._dirty = true;
    this.shadowRoot.querySelector("#save-bar")?.classList.add("visible");
  }

  // ── COLLECT ──────────────────────────────────────────────────────────────

  _collectConfig() {
    const root = this.shadowRoot;

    const location     = root.querySelector("#location-name")?.value.trim() || "Home";
    const kindle_token = root.querySelector("#kindle-token")?.value.trim()  || "";
    const font         = root.querySelector("#font-select")?.value           || "Georgia, serif";
    const inline_units = root.querySelector("#inline-units")?.checked        || false;

    const sections = [...root.querySelectorAll(".section-card")].map(card => {
      const si   = parseInt(card.dataset.si);
      const label = card.querySelector(`.sec-name-input[data-si="${si}"]`)?.value.trim() || "";
      const badge = card.dataset.sectype || "toggles";

      const items = [...card.querySelectorAll(".item-row")].map(row => {
        const rii = parseInt(row.dataset.ii);
        const rsi = parseInt(row.dataset.si);
        const type = row.dataset.type;
        const entity = row.querySelector(`.i-entity[data-si="${rsi}"][data-ii="${rii}"]`)?.value || "";
        const lbl    = row.querySelector(`.i-label[data-si="${rsi}"][data-ii="${rii}"]`)?.value.trim() || "";
        const icon   = row.querySelector(`.i-icon[data-si="${rsi}"][data-ii="${rii}"]`)?.value.trim() || "";
        const unit   = row.querySelector(`.i-unit[data-si="${rsi}"][data-ii="${rii}"]`)?.value.trim() || "";
        const hide   = row.querySelector(`.i-hide[data-si="${rsi}"][data-ii="${rii}"]`)?.checked || false;

        if (type === "sensor") return { id: entity, label: lbl, unit, hide_from_status: hide };
        if (type === "scene")  return { id: `sc_${si}_${rii}`, icon, name: lbl || entity, desc: "", entity };
        return { id: entity, icon, label: lbl || entity, hide_from_status: hide };
      }).filter(item => item.id);

      return { id: `s_${si}`, type: badge, label, items };
    });

    return { location_name: location, kindle_token, font, inline_units, sections };
  }

  // ── ADD / DELETE / MOVE ───────────────────────────────────────────────────

  _addSection() {
    const cfg  = this._collectConfig();
    const type = this.shadowRoot.querySelector("#new-section-type")?.value || "toggles";
    cfg.sections.push({ id: `s_new_${Date.now()}`, type, label: "", items: [] });
    this._config = cfg;
    this._rerender();
  }

  _deleteSection(si) {
    const cfg = this._collectConfig();
    cfg.sections.splice(si, 1);
    this._config = cfg;
    this._rerender();
  }

  _moveSection(si, dir) {
    const cfg = this._collectConfig();
    const to  = si + dir;
    if (to < 0 || to >= cfg.sections.length) return;
    [cfg.sections[si], cfg.sections[to]] = [cfg.sections[to], cfg.sections[si]];
    this._config = cfg;
    this._rerender();
  }

  _addItem(si, type) {
    const cfg = this._collectConfig();
    const sec = cfg.sections[si];
    if (!sec) return;
    // normalise plural section types to singular item types
    const t = type.replace(/s$/, ""); // "sensors"->"sensor", "scenes"->"scene", "toggles"->"toggle"
    if (t === "sensor") sec.items.push({ id: "", label: "", unit: "", hide_from_status: false });
    else if (t === "scene")  sec.items.push({ id: `sc_new_${Date.now()}`, icon: "🎭", name: "New Scene", desc: "", entity: "" });
    else sec.items.push({ id: "", icon: "💡", label: "", hide_from_status: false });
    this._config = cfg;
    this._rerender();
  }

  _deleteItem(si, ii) {
    const cfg = this._collectConfig();
    cfg.sections[si]?.items.splice(ii, 1);
    this._config = cfg;
    this._rerender();
  }

  _rerender() {
    this._render();
    this.shadowRoot.querySelector("#save-bar")?.classList.add("visible");
    this._dirty = true;
  }

  // ── SAVE ─────────────────────────────────────────────────────────────────

  async _save() {
    const cfg = this._collectConfig();
    try {
      await this._hass.callWS({ type: "kindle_dashboard/save_config", config: cfg });
      this._config = cfg;
      this._dirty  = false;
      this.shadowRoot.querySelector("#save-bar")?.classList.remove("visible");
      this._toast("✓ Saved");
      this._render();
    } catch(e) { this._toast("Error: " + e.message); }
  }

  // ── CSS ───────────────────────────────────────────────────────────────────

  _css() { return `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :host {
      display: block; min-height: 100%;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      font-size: 14px;
    }
    .top-bar {
      background: var(--app-header-background-color, var(--primary-color, #03a9f4));
      color: var(--app-header-text-color, #fff);
      padding: 0 16px; height: 56px;
      display: flex; align-items: center; gap: 14px;
      position: sticky; top: 0; z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,.18);
    }
    .top-bar h1 { font-size: 20px; font-weight: 500; flex: 1; }
    .top-bar a {
      color: inherit; font-size: 13px; opacity: .85; text-decoration: none;
      border: 1px solid rgba(255,255,255,.5); padding: 4px 10px; border-radius: 4px; white-space: nowrap;
    }
    .top-bar a:hover { opacity: 1; background: rgba(255,255,255,.12); }
    .save-bar {
      display: none; position: sticky; top: 56px; z-index: 9;
      background: var(--warning-color, #ff9800); color: #fff;
      padding: 8px 16px; align-items: center; gap: 10px; font-size: 13px;
    }
    .save-bar.visible { display: flex; }
    .save-bar span { flex: 1; }
    .save-bar button {
      background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.5); color: #fff;
      padding: 5px 14px; border-radius: 4px; cursor: pointer; font-size: 13px;
    }
    .save-bar button:hover { background: rgba(255,255,255,.35); }
    .save-bar button.primary { background: rgba(0,0,0,.18); font-weight: 600; }
    .content { padding: 16px; max-width: 860px; margin: 0 auto; }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.12);
      margin-bottom: 16px; overflow: hidden;
    }
    .card-header {
      padding: 13px 16px 10px; font-size: 16px; font-weight: 500;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      display: flex; align-items: center; gap: 8px;
    }
    .card-header .icon { font-size: 18px; }
    .hint-inline { font-size: 12px; color: var(--secondary-text-color, #888); font-weight: 400; }
    .card-body { padding: 12px 16px 16px; }
    .hint { font-size: 13px; color: var(--secondary-text-color, #888); margin-bottom: 10px; }
    .form-row { margin-bottom: 12px; }
    .form-row:last-child { margin-bottom: 0; }
    .form-row.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .form-row-inline { display: flex; align-items: center; gap: 10px; }
    label {
      display: block; font-size: 11px; font-weight: 500;
      color: var(--secondary-text-color, #727272); margin-bottom: 4px;
      letter-spacing: .04em; text-transform: uppercase;
    }
    input[type=text], select {
      width: 100%; padding: 7px 9px;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--primary-background-color, #fff);
      color: var(--primary-text-color, #212121); font-size: 13px;
    }
    input[type=text]:focus, select:focus {
      outline: none; border-color: var(--primary-color, #03a9f4);
    }
    .ha-switch { position: relative; display: inline-block; width: 40px; height: 24px; flex-shrink: 0; }
    .ha-switch input { opacity: 0; width: 0; height: 0; }
    .ha-slider {
      position: absolute; cursor: pointer; inset: 0;
      background: #ccc; border-radius: 12px; transition: .2s;
    }
    .ha-slider::before {
      content: ""; position: absolute; width: 18px; height: 18px; left: 3px; bottom: 3px;
      background: #fff; border-radius: 50%; transition: .2s;
    }
    .ha-switch input:checked + .ha-slider { background: var(--primary-color, #03a9f4); }
    .ha-switch input:checked + .ha-slider::before { transform: translateX(16px); }
    .switch-label { font-size: 13px; cursor: pointer; user-select: none; }
    /* ── sections list ── */
    #sections-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; }
    .section-card {
      border: 1px solid var(--divider-color, #ddd); border-radius: 6px; overflow: hidden;
    }
    .section-card-header {
      display: flex; align-items: center; gap: 8px;
      background: var(--secondary-background-color, #f5f5f5);
      padding: 8px 10px;
      border-bottom: 1px solid var(--divider-color, #ddd);
    }
    .sec-type-badge {
      font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
      background: var(--primary-color, #03a9f4); color: #fff;
      padding: 2px 7px; border-radius: 10px; flex-shrink: 0;
    }
    .sec-name-input {
      flex: 1; padding: 5px 8px; font-size: 14px; font-weight: 500;
      border: 1px solid transparent; border-radius: 4px;
      background: transparent; color: var(--primary-text-color);
    }
    .sec-name-input:focus { border-color: var(--primary-color, #03a9f4); background: var(--primary-background-color, #fff); }
    .sec-header-actions { display: flex; gap: 4px; flex-shrink: 0; }
    .move-btn, .del-section-btn {
      background: none; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 3px 7px; cursor: pointer; font-size: 13px;
      color: var(--primary-text-color);
    }
    .move-btn:hover { background: var(--secondary-background-color, #eee); }
    .del-section-btn { color: var(--error-color, #db4437); }
    .del-section-btn:hover { background: rgba(219,68,55,.08); }
    /* items */
    .section-items { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; }
    .item-row {
      display: flex; align-items: center; gap: 6px;
      background: var(--primary-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px; padding: 6px 8px;
    }
    .item-row input[type=text], .item-row select {
      padding: 5px 7px; font-size: 12px;
    }
    .item-row .i-label { flex: 1; }
    .item-row .i-entity { flex: 1.4; }
    .hide-wrap {
      display: flex; flex-direction: column; align-items: center; gap: 1px;
      font-size: 9px; color: var(--secondary-text-color); text-transform: uppercase;
      letter-spacing: .04em; flex-shrink: 0;
    }
    .hide-wrap input[type=checkbox] { width: 15px; height: 15px; cursor: pointer; }
    .del-item-btn {
      background: none; border: none; color: var(--error-color, #db4437);
      cursor: pointer; font-size: 16px; padding: 1px 4px; border-radius: 3px; flex-shrink: 0;
    }
    .del-item-btn:hover { background: rgba(219,68,55,.1); }
    .add-item-btn {
      display: block; width: calc(100% - 20px); margin: 0 10px 10px;
      background: none; border: 1px dashed var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
      padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;
    }
    .add-item-btn:hover { background: rgba(3,169,244,.06); }
    .add-section-row { display: flex; gap: 8px; align-items: center; }
    .add-section-row select { flex: 1; }
    .add-btn {
      background: none; border: 1px solid var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
      padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 13px; white-space: nowrap;
    }
    .add-btn:hover { background: rgba(3,169,244,.06); }
    .kindle-url {
      font-family: monospace; background: var(--secondary-background-color, #f5f5f5);
      padding: 8px 12px; border-radius: 4px; font-size: 12px; word-break: break-all;
      border: 1px solid var(--divider-color, #ddd); min-height: 34px;
    }
    .kindle-url a { color: var(--primary-color, #03a9f4); }
    .muted { color: var(--secondary-text-color, #999); }
    #toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #323232; color: #fff; padding: 10px 22px;
      border-radius: 4px; font-size: 13px; display: none; z-index: 999; white-space: nowrap;
    }
  `; }

  // ── UTIL ─────────────────────────────────────────────────────────────────

  _esc(s) {
    return String(s)
      .replace(/&/g,"&amp;").replace(/"/g,"&quot;")
      .replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  _toast(msg) {
    const el = this.shadowRoot.querySelector("#toast");
    if (!el) return;
    el.textContent = msg; el.style.display = "block";
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { el.style.display = "none"; }, 2200);
  }
}

customElements.define("kindle-dashboard-panel", KindleDashboardPanel);
