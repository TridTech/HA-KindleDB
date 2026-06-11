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

  set panel(panel) {
    this._panelConfig = panel.config;
  }

  async _init() {
    await this._loadConfig();
    await this._loadEntities();
    this._render();
  }

  async _loadConfig() {
    try {
      this._config = await this._hass.callWS({ type: "kindle_dashboard/get_config" });
    } catch (e) {
      this._config = {};
    }
  }

  async _loadEntities() {
    try {
      const res = await this._hass.callWS({
        type: "kindle_dashboard/get_entities",
        domains: ["light", "switch", "scene", "sensor", "input_boolean"],
      });
      this._entities = res.entities || [];
    } catch (e) {
      this._entities = [];
    }
  }

  _render() {
    const cfg = this._config || {};
    const location = cfg.location_name || "Home";
    const scenes   = cfg.scenes  || [];
    const toggles  = cfg.toggles || [];
    const stats    = cfg.stats   || [];

    const sceneEntities  = this._entities.filter(e => e.domain === "scene");
    const toggleEntities = this._entities.filter(e => ["light","switch","input_boolean"].includes(e.domain));
    const sensorEntities = this._entities.filter(e => e.domain === "sensor");

    this.shadowRoot.innerHTML = `
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :host {
          display: block;
          min-height: 100%;
          background: var(--primary-background-color, #fafafa);
          color: var(--primary-text-color, #212121);
          font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
          font-size: 14px;
        }

        /* ── HEADER ─────────────────── */
        .top-bar {
          background: var(--app-header-background-color, var(--primary-color, #03a9f4));
          color: var(--app-header-text-color, #fff);
          padding: 0 16px;
          height: 56px;
          display: flex;
          align-items: center;
          gap: 14px;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,.18);
        }
        .top-bar h1 { font-size: 20px; font-weight: 500; flex: 1; }
        .top-bar a {
          color: inherit;
          font-size: 13px;
          opacity: .85;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,.5);
          padding: 4px 10px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .top-bar a:hover { opacity: 1; background: rgba(255,255,255,.12); }

        /* ── SAVE BAR ───────────────── */
        .save-bar {
          display: none;
          position: sticky;
          top: 56px;
          z-index: 9;
          background: var(--warning-color, #ff9800);
          color: #fff;
          padding: 8px 16px;
          align-items: center;
          gap: 10px;
          font-size: 13px;
        }
        .save-bar.visible { display: flex; }
        .save-bar span { flex: 1; }
        .save-bar button {
          background: rgba(255,255,255,.2);
          border: 1px solid rgba(255,255,255,.5);
          color: #fff;
          padding: 5px 14px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        }
        .save-bar button:hover { background: rgba(255,255,255,.35); }
        .save-bar button.primary {
          background: rgba(0,0,0,.18);
          font-weight: 600;
        }

        /* ── MAIN CONTENT ───────────── */
        .content { padding: 16px; max-width: 820px; margin: 0 auto; }

        /* ── CARDS ──────────────────── */
        .card {
          background: var(--card-background-color, #fff);
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,.12);
          margin-bottom: 16px;
          overflow: hidden;
        }
        .card-header {
          padding: 14px 16px 10px;
          font-size: 16px;
          font-weight: 500;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-header .icon { font-size: 18px; }
        .card-body { padding: 12px 16px 16px; }

        /* ── FORM ROWS ──────────────── */
        .form-row { margin-bottom: 14px; }
        .form-row:last-child { margin-bottom: 0; }
        label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: var(--secondary-text-color, #727272);
          margin-bottom: 5px;
          letter-spacing: .03em;
          text-transform: uppercase;
        }
        input[type=text], select {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 4px;
          background: var(--primary-background-color, #fff);
          color: var(--primary-text-color, #212121);
          font-size: 14px;
        }
        input[type=text]:focus, select:focus {
          outline: none;
          border-color: var(--primary-color, #03a9f4);
        }

        /* ── LIST (scenes / toggles / stats) ── */
        .item-list { display: flex; flex-direction: column; gap: 8px; }

        .item-row {
          display: grid;
          grid-template-columns: 36px 1fr 1fr auto;
          gap: 6px;
          align-items: center;
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 6px;
          padding: 8px 10px;
        }
        .item-row.stats-row {
          grid-template-columns: 1fr 80px 60px auto;
        }

        .item-icon-input {
          width: 36px;
          padding: 6px 4px;
          text-align: center;
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 4px;
          background: var(--primary-background-color, #fff);
          color: var(--primary-text-color);
          font-size: 16px;
        }
        .item-label-input {
          padding: 6px 8px;
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 4px;
          background: var(--primary-background-color, #fff);
          color: var(--primary-text-color);
          font-size: 13px;
          width: 100%;
        }
        .item-entity-select {
          padding: 6px 8px;
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 4px;
          background: var(--primary-background-color, #fff);
          color: var(--primary-text-color);
          font-size: 13px;
          width: 100%;
        }
        .delete-btn {
          background: none;
          border: none;
          color: var(--error-color, #db4437);
          cursor: pointer;
          font-size: 18px;
          padding: 2px 4px;
          border-radius: 4px;
          line-height: 1;
        }
        .delete-btn:hover { background: rgba(219,68,55,.1); }

        .add-btn {
          margin-top: 10px;
          background: none;
          border: 1px dashed var(--primary-color, #03a9f4);
          color: var(--primary-color, #03a9f4);
          padding: 7px 14px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          width: 100%;
        }
        .add-btn:hover { background: rgba(3,169,244,.06); }

        /* ── KINDLE PREVIEW LINK ─────── */
        .kindle-url {
          font-family: monospace;
          background: var(--secondary-background-color, #f5f5f5);
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 13px;
          word-break: break-all;
          border: 1px solid var(--divider-color, #ddd);
        }
        .kindle-url a { color: var(--primary-color, #03a9f4); }

        /* ── TOAST ───────────────────── */
        #toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #323232;
          color: #fff;
          padding: 10px 22px;
          border-radius: 4px;
          font-size: 13px;
          display: none;
          z-index: 999;
          white-space: nowrap;
        }
      </style>

      <!-- TOP BAR -->
      <div class="top-bar">
        <h1>📱 Kindle Dashboard</h1>
        <a href="/api/kindle_dashboard/kindle" target="_blank">Open Kindle View ↗</a>
      </div>

      <!-- UNSAVED CHANGES BAR -->
      <div class="save-bar" id="save-bar">
        <span>You have unsaved changes</span>
        <button id="discard-btn">Discard</button>
        <button class="primary" id="save-btn">Save</button>
      </div>

      <div class="content">

        <!-- KINDLE URL CARD -->
        <div class="card">
          <div class="card-header"><span class="icon">🔗</span> Kindle URL</div>
          <div class="card-body">
            <p style="margin-bottom:8px;color:var(--secondary-text-color);">
              Point your Kindle browser to this address. It refreshes every 60 seconds automatically.
            </p>
            <div class="kindle-url">
              <a id="kindle-url-link" href="/api/kindle_dashboard/kindle" target="_blank">
                ${window.location.origin}/api/kindle_dashboard/kindle
              </a>
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
          </div>
        </div>

        <!-- STATUS SENSORS -->
        <div class="card">
          <div class="card-header"><span class="icon">📊</span> Status Sensors <small style="font-weight:400;font-size:13px;margin-left:4px;">(top panel)</small></div>
          <div class="card-body">
            <div class="item-list" id="stats-list">
              ${stats.map((s, i) => this._statRow(s, i, sensorEntities)).join("")}
            </div>
            <button class="add-btn" id="add-stat-btn">+ Add Sensor</button>
          </div>
        </div>

        <!-- SCENES -->
        <div class="card">
          <div class="card-header"><span class="icon">🎭</span> Scenes</div>
          <div class="card-body">
            <div class="item-list" id="scenes-list">
              ${scenes.map((s, i) => this._sceneRow(s, i, sceneEntities)).join("")}
            </div>
            <button class="add-btn" id="add-scene-btn">+ Add Scene</button>
          </div>
        </div>

        <!-- TOGGLES -->
        <div class="card">
          <div class="card-header"><span class="icon">💡</span> Toggles <small style="font-weight:400;font-size:13px;margin-left:4px;">(lights &amp; switches)</small></div>
          <div class="card-body">
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
    return `
      <div class="item-row" data-index="${i}" data-type="toggle">
        <input class="item-icon-input toggle-icon" data-index="${i}" type="text" placeholder="💡" value="${this._esc(toggle.icon || "")}">
        <input class="item-label-input toggle-label" data-index="${i}" type="text" placeholder="Label" value="${this._esc(toggle.label || "")}">
        <select class="item-entity-select toggle-entity" data-index="${i}">
          <option value="">— pick entity —</option>${opts}
        </select>
        <button class="delete-btn" data-index="${i}" data-type="toggle">✕</button>
      </div>`;
  }

  // ── LISTENERS ────────────────────────────────────────────────────────────

  _attachListeners() {
    const root = this.shadowRoot;

    // Mark dirty on any input change
    root.addEventListener("change", () => this._markDirty());
    root.addEventListener("input",  () => this._markDirty());

    // Delete buttons
    root.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-btn");
      if (!btn) return;
      const type  = btn.dataset.type;
      const index = parseInt(btn.dataset.index, 10);
      this._deleteItem(type, index);
    });

    // Add buttons
    root.querySelector("#add-stat-btn")  .addEventListener("click", () => this._addItem("stat"));
    root.querySelector("#add-scene-btn") .addEventListener("click", () => this._addItem("scene"));
    root.querySelector("#add-toggle-btn").addEventListener("click", () => this._addItem("toggle"));

    // Save / discard
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

    const location = root.querySelector("#location-name").value.trim() || "Home";

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
      return {
        id:      `scene_${i}`,
        icon,
        name:    name || ent,
        desc:    "",
        service: "scene/turn_on",
        entity:  ent,
      };
    }).filter(s => s.entity);

    const toggles = [...root.querySelectorAll(".item-row[data-type='toggle']")].map(row => {
      const i    = row.dataset.index;
      const ent  = root.querySelector(`.toggle-entity[data-index="${i}"]`).value;
      const label = root.querySelector(`.toggle-label[data-index="${i}"]`).value.trim();
      const icon  = root.querySelector(`.toggle-icon[data-index="${i}"]`).value.trim() || "💡";
      return {
        id:       ent,
        icon,
        label:    label || ent,
        sublabel: ent,
      };
    }).filter(t => t.id);

    return { location_name: location, scenes, toggles, stats };
  }

  // ── ADD / DELETE ─────────────────────────────────────────────────────────

  _addItem(type) {
    const cfg = this._collectConfig();
    if (type === "stat")   cfg.stats.push({ id: "", label: "Sensor", unit: "" });
    if (type === "scene")  cfg.scenes.push({ id: `scene_new_${Date.now()}`, icon: "🎭", name: "New Scene", desc: "", service: "scene/turn_on", entity: "" });
    if (type === "toggle") cfg.toggles.push({ id: "", icon: "💡", label: "New Toggle", sublabel: "" });
    this._config = cfg;
    this._markDirty();
    this._render();
    // Re-mark dirty after re-render (render resets)
    this.shadowRoot.querySelector("#save-bar").classList.add("visible");
    this._dirty = true;
  }

  _deleteItem(type, index) {
    const cfg = this._collectConfig();
    if (type === "stat")   cfg.stats.splice(index, 1);
    if (type === "scene")  cfg.scenes.splice(index, 1);
    if (type === "toggle") cfg.toggles.splice(index, 1);
    this._config = cfg;
    this._markDirty();
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
    } catch (e) {
      this._toast("Error saving: " + e.message);
    }
  }

  // ── UTIL ─────────────────────────────────────────────────────────────────

  _esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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
