/**
 * Kindle Dashboard — HA Sidebar Config Panel
 * Registered as <kindle-dashboard-panel> custom element.
 */
class KindleDashboardPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._config = null;
    this._entities = [];
    this._dirty = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) this._init();
  }

  set panel(panel) { this._panelConfig = panel.config; }

  async _init() {
    await this._loadConfig();
    await this._loadEntities();
    this._render();
  }

  async _loadConfig() {
    try {
      this._config = await this._hass.callWS({ type: "kindle_dashboard/get_config" });
    } catch (e) { this._config = {}; }
  }

  async _loadEntities() {
    try {
      const res = await this._hass.callWS({
        type: "kindle_dashboard/get_entities",
        domains: ["light", "switch", "scene", "sensor", "input_boolean"],
      });
      this._entities = res.entities || [];
    } catch (e) { this._entities = []; }
  }

  _render() {
    const cfg = this._config || {};
    const location      = cfg.location_name || "Home";
    const scenes        = cfg.scenes  || [];
    const toggles       = cfg.toggles || [];
    const stats         = cfg.stats   || [];
    const showScenes    = cfg.show_scenes !== false;
    const scenesLabel   = cfg.section_scenes_label  || "Scenes";
    const togglesLabel  = cfg.section_toggles_label || "Lights & Switches";
    const kindleToken   = cfg.kindle_token || "";

    const sceneEntities  = this._entities.filter(e => e.domain === "scene");
    const toggleEntities = this._entities.filter(e => ["light","switch","input_boolean"].includes(e.domain));
    const sensorEntities = this._entities.filter(e => e.domain === "sensor");

    const tokenUrl = kindleToken
      ? `${window.location.origin}/api/kindle_dashboard/kindle?token=${encodeURIComponent(kindleToken)}`
      : "";

    this.shadowRoot.innerHTML = `
      <style>
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
          color: inherit; font-size: 13px; opacity: .85;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,.5);
          padding: 4px 10px; border-radius: 4px; white-space: nowrap;
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
          background: rgba(255,255,255,.2);
          border: 1px solid rgba(255,255,255,.5); color: #fff;
          padding: 5px 14px; border-radius: 4px; cursor: pointer; font-size: 13px;
        }
        .save-bar button:hover { background: rgba(255,255,255,.35); }
        .save-bar button.primary { background: rgba(0,0,0,.18); font-weight: 600; }
        .content { padding: 16px; max-width: 820px; margin: 0 auto; }
        .card {
          background: var(--card-background-color, #fff);
          border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.12);
          margin-bottom: 16px; overflow: hidden;
        }
        .card-header {
          padding: 14px 16px 10px; font-size: 16px; font-weight: 500;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
          display: flex; align-items: center; gap: 8px;
        }
        .card-header .icon { font-size: 18px; }
        .card-body { padding: 12px 16px 16px; }
        .form-row { margin-bottom: 14px; }
        .form-row:last-child { margin-bottom: 0; }
        .form-row-inline {
          display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
        }
        .form-row-inline:last-child { margin-bottom: 0; }
        label {
          display: block; font-size: 12px; font-weight: 500;
          color: var(--secondary-text-color, #727272);
          margin-bottom: 5px; letter-spacing: .03em; text-transform: uppercase;
        }
        input[type=text], select {
          width: 100%; padding: 8px 10px;
          border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
          background: var(--primary-background-color, #fff);
          color: var(--primary-text-color, #212121); font-size: 14px;
        }
        input[type=text]:focus, select:focus {
          outline: none; border-color: var(--primary-color, #03a9f4);
        }
        /* ── toggle switch (show/hide scenes) ── */
        .ha-switch {
          position: relative; display: inline-block; width: 40px; height: 24px;
          flex-shrink: 0;
        }
        .ha-switch input { opacity: 0; width: 0; height: 0; }
        .ha-slider {
          position: absolute; cursor: pointer; inset: 0;
          background: #ccc; border-radius: 12px; transition: .2s;
        }
        .ha-slider::before {
          content: ""; position: absolute;
          width: 18px; height: 18px; left: 3px; bottom: 3px;
          background: #fff; border-radius: 50%; transition: .2s;
        }
        .ha-switch input:checked + .ha-slider { background: var(--primary-color, #03a9f4); }
        .ha-switch input:checked + .ha-slider::before { transform: translateX(16px); }
        .switch-label { font-size: 14px; cursor: pointer; user-select: none; }
        /* ── item lists ── */
        .item-list { display: flex; flex-direction: column; gap: 8px; }
        .item-row {
          display: grid;
          grid-template-columns: 36px 1fr 1fr auto;
          gap: 6px; align-items: center;
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 6px; padding: 8px 10px;
        }
        .item-row.stats-row  { grid-template-columns: 1fr 80px 60px auto; }
        /* toggles get an extra checkbox column */
        .item-row.toggle-row { grid-template-columns: 36px 1fr 1fr auto auto; }
        .item-icon-input {
          width: 36px; padding: 6px 4px; text-align: center;
          border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
          background: var(--primary-background-color, #fff);
          color: var(--primary-text-color); font-size: 16px;
        }
        .item-label-input, .item-entity-select {
          padding: 6px 8px;
          border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
          background: var(--primary-background-color, #fff);
          color: var(--primary-text-color); font-size: 13px; width: 100%;
        }
        .delete-btn {
          background: none; border: none;
          color: var(--error-color, #db4437); cursor: pointer;
          font-size: 18px; padding: 2px 4px; border-radius: 4px; line-height: 1;
        }
        .delete-btn:hover { background: rgba(219,68,55,.1); }
        /* hide-from-status checkbox */
        .hide-check-wrap {
          display: flex; flex-direction: column; align-items: center;
          gap: 2px; font-size: 9px; color: var(--secondary-text-color);
          text-transform: uppercase; letter-spacing: .04em;
        }
        .hide-check-wrap input[type=checkbox] { width: 16px; height: 16px; cursor: pointer; }
        .add-btn {
          margin-top: 10px; background: none;
          border: 1px dashed var(--primary-color, #03a9f4);
          color: var(--primary-color, #03a9f4);
          padding: 7px 14px; border-radius: 4px; cursor: pointer;
          font-size: 13px; width: 100%;
        }
        .add-btn:hover { background: rgba(3,169,244,.06); }
        .kindle-url {
          font-family: monospace;
          background: var(--secondary-background-color, #f5f5f5);
          padding: 8px 12px; border-radius: 4px; font-size: 12px;
          word-break: break-all;
          border: 1px solid var(--divider-color, #ddd); min-height: 36px;
        }
        .kindle-url a { color: var(--primary-color, #03a9f4); }
        #toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          background: #323232; color: #fff; padding: 10px 22px;
          border-radius: 4px; font-size: 13px; display: none; z-index: 999;
          white-space: nowrap;
        }
      </style>

      <!-- TOP BAR -->
      <div class="top-bar">
        <h1>📱 Kindle Dashboard</h1>
        ${tokenUrl ? `<a href="${this._esc(tokenUrl)}" target="_blank">Open Kindle View ↗</a>` : ""}
      </div>

      <!-- UNSAVED CHANGES BAR -->
      <div class="save-bar" id="save-bar">
        <span>You have unsaved changes</span>
        <button id="discard-btn">Discard</button>
        <button class="primary" id="save-btn">Save</button>
      </div>

      <div class="content">

        <!-- KINDLE URL -->
        <div class="card">
          <div class="card-header"><span class="icon">🔗</span> Kindle URL</div>
          <div class="card-body">
            <p style="margin-bottom:10px;color:var(--secondary-text-color)">
              The Kindle browser doesn't keep login sessions, so the URL includes
              a long-lived access token. Generate one in your
              <strong>HA profile → Long-Lived Access Tokens</strong>, paste it
              below, then bookmark the resulting URL on your Kindle.
            </p>
            <div class="form-row">
              <label>Long-Lived Access Token</label>
              <input type="text" id="kindle-token" placeholder="Paste token here…"
                     value="${this._esc(kindleToken)}"
                     style="font-family:monospace;font-size:12px">
            </div>
            <div class="form-row">
              <label>Kindle Bookmark URL</label>
              <div class="kindle-url" id="kindle-url-display">
                ${tokenUrl
                  ? `<a href="${this._esc(tokenUrl)}" target="_blank">${this._esc(tokenUrl)}</a>`
                  : '<span style="color:#999">Paste a token above and save to generate the URL</span>'
                }
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
            <div class="form-row-inline">
              <label class="ha-switch" for="show-scenes-toggle">
                <input type="checkbox" id="show-scenes-toggle" ${showScenes ? "checked" : ""}>
                <span class="ha-slider"></span>
              </label>
              <span class="switch-label" id="show-scenes-label">
                ${showScenes ? "Scenes section visible" : "Scenes section hidden"}
              </span>
            </div>
          </div>
        </div>

        <!-- STATUS SENSORS -->
        <div class="card">
          <div class="card-header"><span class="icon">📊</span> Status Sensors <small style="font-weight:400;font-size:13px;margin-left:4px">(top panel)</small></div>
          <div class="card-body">
            <div class="item-list" id="stats-list">
              ${stats.map((s, i) => this._statRow(s, i, sensorEntities)).join("")}
            </div>
            <button class="add-btn" id="add-stat-btn">+ Add Sensor</button>
          </div>
        </div>

        <!-- SCENES -->
        <div class="card">
          <div class="card-header"><span class="icon">🎭</span> Scenes Section</div>
          <div class="card-body">
            <div class="form-row">
              <label>Section Heading</label>
              <input type="text" id="scenes-label" value="${this._esc(scenesLabel)}" placeholder="Scenes">
            </div>
            <div class="item-list" id="scenes-list">
              ${scenes.map((s, i) => this._sceneRow(s, i, sceneEntities)).join("")}
            </div>
            <button class="add-btn" id="add-scene-btn">+ Add Scene</button>
          </div>
        </div>

        <!-- TOGGLES -->
        <div class="card">
          <div class="card-header"><span class="icon">💡</span> Toggles Section</div>
          <div class="card-body">
            <div class="form-row">
              <label>Section Heading</label>
              <input type="text" id="toggles-label" value="${this._esc(togglesLabel)}" placeholder="Lights &amp; Switches">
            </div>
            <div class="item-list" id="toggles-list">
              ${toggles.map((t, i) => this._toggleRow(t, i, toggleEntities)).join("")}
            </div>
            <button class="add-btn" id="add-toggle-btn">+ Add Toggle</button>
          </div>
        </div>

      </div>
      <div id="toast"></div>
    `;

    this._attachListeners();
  }

  // ── ROW TEMPLATES ────────────────────────────────────────────────────────

  _statRow(stat, i, entities) {
    const opts = entities.map(e =>
      `<option value="${e.entity_id}" ${e.entity_id === stat.id ? "selected" : ""}>${e.name} (${e.entity_id})</option>`
    ).join("");
    return `
      <div class="item-row stats-row" data-index="${i}" data-type="stat">
        <select class="item-entity-select stat-entity" data-index="${i}">
          <option value="">— pick sensor —</option>${opts}
        </select>
        <input class="item-label-input stat-label" data-index="${i}" type="text" placeholder="Label" value="${this._esc(stat.label || "")}">
        <input class="item-label-input stat-unit"  data-index="${i}" type="text" placeholder="Unit"  value="${this._esc(stat.unit  || "")}">
        <button class="delete-btn" data-index="${i}" data-type="stat">✕</button>
      </div>`;
  }

  _sceneRow(scene, i, entities) {
    const opts = entities.map(e =>
      `<option value="${e.entity_id}" ${e.entity_id === scene.entity ? "selected" : ""}>${e.name} (${e.entity_id})</option>`
    ).join("");
    return `
      <div class="item-row" data-index="${i}" data-type="scene">
        <input class="item-icon-input scene-icon" data-index="${i}" type="text" placeholder="🎭" value="${this._esc(scene.icon || "")}">
        <input class="item-label-input scene-name" data-index="${i}" type="text" placeholder="Name" value="${this._esc(scene.name || "")}">
        <select class="item-entity-select scene-entity" data-index="${i}">
          <option value="">— pick scene —</option>${opts}
        </select>
        <button class="delete-btn" data-index="${i}" data-type="scene">✕</button>
      </div>`;
  }

  _toggleRow(toggle, i, entities) {
    const opts = entities.map(e =>
      `<option value="${e.entity_id}" ${e.entity_id === toggle.id ? "selected" : ""}>${e.name} (${e.entity_id})</option>`
    ).join("");
    const hidden = toggle.hide_from_status ? "checked" : "";
    return `
      <div class="item-row toggle-row" data-index="${i}" data-type="toggle">
        <input class="item-icon-input toggle-icon" data-index="${i}" type="text" placeholder="💡" value="${this._esc(toggle.icon || "")}">
        <input class="item-label-input toggle-label" data-index="${i}" type="text" placeholder="Label" value="${this._esc(toggle.label || "")}">
        <select class="item-entity-select toggle-entity" data-index="${i}">
          <option value="">— pick entity —</option>${opts}
        </select>
        <div class="hide-check-wrap" title="Exclude from the light status dots at the top">
          <input type="checkbox" class="toggle-hide-status" data-index="${i}" ${hidden}>
          <span>Hide<br>status</span>
        </div>
        <button class="delete-btn" data-index="${i}" data-type="toggle">✕</button>
      </div>`;
  }

  // ── LISTENERS ────────────────────────────────────────────────────────────

  _attachListeners() {
    const root = this.shadowRoot;

    root.addEventListener("change", () => this._markDirty());
    root.addEventListener("input",  () => this._markDirty());

    // Live-update the scenes toggle label
    root.querySelector("#show-scenes-toggle").addEventListener("change", (e) => {
      root.querySelector("#show-scenes-label").textContent =
        e.target.checked ? "Scenes section visible" : "Scenes section hidden";
    });

    // Delete buttons
    root.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-btn");
      if (!btn) return;
      this._deleteItem(btn.dataset.type, parseInt(btn.dataset.index, 10));
    });

    root.querySelector("#add-stat-btn")  .addEventListener("click", () => this._addItem("stat"));
    root.querySelector("#add-scene-btn") .addEventListener("click", () => this._addItem("scene"));
    root.querySelector("#add-toggle-btn").addEventListener("click", () => this._addItem("toggle"));

    root.querySelector("#save-btn")   .addEventListener("click", () => this._save());
    root.querySelector("#discard-btn").addEventListener("click", () => { this._config = null; this._init(); });
  }

  _markDirty() {
    this._dirty = true;
    this.shadowRoot.querySelector("#save-bar").classList.add("visible");
  }

  // ── COLLECT FORM STATE ───────────────────────────────────────────────────

  _collectConfig() {
    const root = this.shadowRoot;

    const location      = root.querySelector("#location-name").value.trim() || "Home";
    const kindle_token  = (root.querySelector("#kindle-token")?.value || "").trim();
    const show_scenes   = root.querySelector("#show-scenes-toggle").checked;
    const section_scenes_label  = root.querySelector("#scenes-label").value.trim()  || "Scenes";
    const section_toggles_label = root.querySelector("#toggles-label").value.trim() || "Lights & Switches";

    const stats = [...root.querySelectorAll(".item-row[data-type='stat']")].map(row => {
      const i = row.dataset.index;
      return {
        id:    root.querySelector(`.stat-entity[data-index="${i}"]`).value,
        label: root.querySelector(`.stat-label[data-index="${i}"]`).value.trim(),
        unit:  root.querySelector(`.stat-unit[data-index="${i}"]`).value.trim(),
      };
    }).filter(s => s.id);

    const scenes = [...root.querySelectorAll(".item-row[data-type='scene']")].map(row => {
      const i    = row.dataset.index;
      const name = root.querySelector(`.scene-name[data-index="${i}"]`).value.trim();
      const ent  = root.querySelector(`.scene-entity[data-index="${i}"]`).value;
      const icon = root.querySelector(`.scene-icon[data-index="${i}"]`).value.trim() || "🎭";
      return { id: `scene_${i}`, icon, name: name || ent, desc: "", service: "scene/turn_on", entity: ent };
    }).filter(s => s.entity);

    const toggles = [...root.querySelectorAll(".item-row[data-type='toggle']")].map(row => {
      const i    = row.dataset.index;
      const ent  = root.querySelector(`.toggle-entity[data-index="${i}"]`).value;
      const label = root.querySelector(`.toggle-label[data-index="${i}"]`).value.trim();
      const icon  = root.querySelector(`.toggle-icon[data-index="${i}"]`).value.trim() || "💡";
      const hide  = root.querySelector(`.toggle-hide-status[data-index="${i}"]`).checked;
      return { id: ent, icon, label: label || ent, sublabel: ent, hide_from_status: hide };
    }).filter(t => t.id);

    return { location_name: location, kindle_token, show_scenes, section_scenes_label, section_toggles_label, scenes, toggles, stats };
  }

  // ── ADD / DELETE ─────────────────────────────────────────────────────────

  _addItem(type) {
    const cfg = this._collectConfig();
    if (type === "stat")   cfg.stats.push({ id: "", label: "Sensor", unit: "" });
    if (type === "scene")  cfg.scenes.push({ id: `scene_new_${Date.now()}`, icon: "🎭", name: "New Scene", desc: "", service: "scene/turn_on", entity: "" });
    if (type === "toggle") cfg.toggles.push({ id: "", icon: "💡", label: "New Toggle", sublabel: "", hide_from_status: false });
    this._config = cfg;
    this._render();
    this.shadowRoot.querySelector("#save-bar").classList.add("visible");
    this._dirty = true;
  }

  _deleteItem(type, index) {
    const cfg = this._collectConfig();
    if (type === "stat")   cfg.stats.splice(index, 1);
    if (type === "scene")  cfg.scenes.splice(index, 1);
    if (type === "toggle") cfg.toggles.splice(index, 1);
    this._config = cfg;
    this._render();
    this.shadowRoot.querySelector("#save-bar").classList.add("visible");
    this._dirty = true;
  }

  // ── SAVE ─────────────────────────────────────────────────────────────────

  async _save() {
    const cfg = this._collectConfig();
    try {
      await this._hass.callWS({ type: "kindle_dashboard/save_config", config: cfg });
      this._config = cfg;
      this._dirty  = false;
      this.shadowRoot.querySelector("#save-bar").classList.remove("visible");
      this._toast("✓ Saved");
      this._render();
    } catch (e) { this._toast("Error saving: " + e.message); }
  }

  // ── UTIL ─────────────────────────────────────────────────────────────────

  _esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  _toast(msg) {
    const el = this.shadowRoot.querySelector("#toast");
    if (!el) return;
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { el.style.display = "none"; }, 2200);
  }
}

customElements.define("kindle-dashboard-panel", KindleDashboardPanel);
