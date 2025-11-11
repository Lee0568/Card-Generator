const els = {
  cardWrap: document.getElementById('cardWrap'),
  card: document.getElementById('card'),
  tag: document.getElementById('cardTag'),
  title: document.getElementById('cardTitle'),
  desc: document.getElementById('cardDesc'),
  costs: document.getElementById('cardCosts'),
  icon: document.getElementById('cardIcon'),
  era: document.getElementById('cardEra'),
  energy: document.getElementById('cardEnergy'),
  schemaStatus: document.getElementById('schemaStatus'),
  schemaPanel: document.getElementById('schemaPanel'),
};

const flds = {
  tag: document.getElementById('fldTag'),
  title: document.getElementById('fldTitle'),
  desc: document.getElementById('fldDesc'),
  era: document.getElementById('fldEra'),
  energy: document.getElementById('fldEnergy'),
  iconEmoji: document.getElementById('fldIconEmoji'),
  iconUpload: document.getElementById('fldIconUpload'),
  costList: document.getElementById('costList'),
  btnAddCost: document.getElementById('btnAddCost'),
  theme: document.getElementById('fldTheme'),
  themeColor: document.getElementById('fldThemeColor'),
  darkMode: document.getElementById('fldDarkMode'),
  btnExportPng: document.getElementById('btnExportPng'),
  btnCopyJson: document.getElementById('btnCopyJson'),
  btnSave: document.getElementById('btnSave'),
  btnLoad: document.getElementById('btnLoad'),
  btnClear: document.getElementById('btnClear'),
  exportScale: document.getElementById('fldExportScale'),
  exportTransparent: document.getElementById('fldExportTransparent'),
  exportPad: document.getElementById('fldExportPad'),
};

let uploadedIconUrl = null;
let costsState = [
  { icon: '🧱', amount: 4 },
  { icon: '⚒', amount: 2 },
];

function setTheme(name) {
  const clsMap = {
    indigo: '',
    teal: 'theme-teal',
    rose: 'theme-rose',
    amber: 'theme-amber',
  };
  document.body.classList.remove('theme-teal', 'theme-rose', 'theme-amber');
  if (clsMap[name]) {
    if (clsMap[name].length) document.body.classList.add(clsMap[name]);
  }
}

function setPrimaryColor(hex) {
  if (!/^#([0-9a-fA-F]{6})$/.test(hex)) return;
  document.documentElement.style.setProperty('--theme', hex);
  const weak = lightenHex(hex, 0.85);
  document.documentElement.style.setProperty('--theme-weak', weak);
}

function lightenHex(hex, ratio) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const toHex = v => ('0' + Math.round(v).toString(16)).slice(-2);
  const lr = r + (255 - r) * ratio;
  const lg = g + (255 - g) * ratio;
  const lb = b + (255 - b) * ratio;
  return `#${toHex(lr)}${toHex(lg)}${toHex(lb)}`;
}

function renderCostListEditor() {
  flds.costList.innerHTML = costsState.map((c, idx) => `
    <div class="cost-item" data-idx="${idx}">
      <div class="drag">≡</div>
      <input class="ci-icon" type="text" maxlength="2" value="${c.icon}" />
      <input class="ci-num" type="number" min="0" value="${c.amount}" />
      <button class="btn btn-del" type="button">删除</button>
    </div>
  `).join('');
}

function renderCosts() {
  els.costs.innerHTML = costsState.filter(c => Number(c.amount) > 0).map(ci => `
    <span class="chip"><span class="ico">${ci.icon}</span><span class="num">${ci.amount}</span></span>
  `).join('');
}

function render() {
  els.tag.textContent = flds.tag.value || '标签';
  els.title.textContent = flds.title.value || '标题';
  renderDesc();
  els.era.textContent = String(flds.era.value || 0);
  els.energy.textContent = String(flds.energy.value || 0);

  if (uploadedIconUrl) {
    els.icon.style.backgroundImage = `url(${uploadedIconUrl})`;
    els.icon.style.backgroundSize = 'cover';
    els.icon.textContent = '';
  } else {
    els.icon.style.backgroundImage = '';
    els.icon.textContent = flds.iconEmoji.value || '🎴';
  }

  renderCosts();
  renderCostListEditor();
  setTheme(flds.theme.value);
  setPrimaryColor(flds.themeColor.value);
  document.body.classList.toggle('dark', !!flds.darkMode.checked);
  validateSchema();
  autoSave();
}

// 导出 PNG
flds.btnExportPng.addEventListener('click', async () => {
  const scale = Number(flds.exportScale.value || 2);
  const transparent = !!flds.exportTransparent.checked;
  els.cardWrap.style.setProperty('--export-pad', `${Number(flds.exportPad.value || 0)}px`);
  const canvas = await html2canvas(els.cardWrap, { backgroundColor: transparent ? null : '#ffffff', scale });
  const link = document.createElement('a');
  link.download = `${flds.title.value || 'card'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// 复制 JSON（生成器结构）
flds.btnCopyJson.addEventListener('click', async () => {
  const json = buildGeneratorJson();
  await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
  flds.btnCopyJson.textContent = '已复制';
  setTimeout(() => (flds.btnCopyJson.textContent = '复制 JSON'), 1200);
});

function buildGeneratorJson() {
  return {
    tag: flds.tag.value,
    title: flds.title.value,
    desc: flds.desc.value,
    era: Number(flds.era.value || 0),
    energy: Number(flds.energy.value || 0),
    iconEmoji: uploadedIconUrl ? null : (flds.iconEmoji.value || ''),
    iconUrl: uploadedIconUrl || null,
    costs: costsState.map(c => ({ icon: c.icon, amount: Number(c.amount||0) })),
    theme: flds.theme.value,
    themeColor: flds.themeColor.value,
    dark: !!flds.darkMode.checked,
  };
}

// 构造与 Schema 兼容的最小 JSON（示例映射）
function buildSchemaJson() {
  const gen = buildGeneratorJson();
  return {
    id: `GEN-${Date.now()}`,
    name: gen.title,
    set: 'Core',
    type: 'Event',
    rarity: 'Common',
    cost: gen.energy,
    rules_text: gen.desc,
    flavor_text: '',
    keywords: ['Tech'],
    visual: { illustration: gen.iconUrl || '', icon: gen.iconEmoji || '' },
    meta: { version: '1.0.0' }
  };
}

// Schema 校验
let ajv, validate;
async function loadSchema() {
  try {
    const res = await fetch('schema/card.schema.json');
    const schema = await res.json();
    ajv = new Ajv({ allErrors: true });
    validate = ajv.compile(schema);
  } catch (e) {
    console.warn('Schema 加载失败', e);
  }
}

function validateSchema() {
  if (!validate) return;
  const data = buildSchemaJson();
  const ok = validate(data);
  els.schemaStatus.textContent = ok ? '校验通过' : '校验失败';
  els.schemaStatus.classList.toggle('ok', !!ok);
  els.schemaStatus.classList.toggle('err', !ok);
  if (!ok) {
    const errs = validate.errors || [];
    els.schemaPanel.innerHTML = `<h3>结构校验错误</h3><ul>${errs.map(e => `<li>${e.instancePath || '/'} ${e.message}</li>`).join('')}</ul>`;
    els.schemaPanel.hidden = false;
  } else {
    els.schemaPanel.hidden = true;
  }
}

// 事件绑定
Object.values(flds).forEach(el => {
  if (!el) return;
  const evt = el.tagName === 'SELECT' || el.type === 'file' ? 'change' : 'input';
  el.addEventListener(evt, render);
});

// 上传图标
flds.iconUpload.addEventListener('change', () => {
  const file = flds.iconUpload.files?.[0];
  if (!file) { uploadedIconUrl = null; render(); return; }
  const reader = new FileReader();
  reader.onload = () => { uploadedIconUrl = reader.result; render(); };
  reader.readAsDataURL(file);
});

// 成本编辑：添加、删除、修改
flds.btnAddCost.addEventListener('click', () => {
  costsState.push({ icon: '📦', amount: 1 });
  render();
});

flds.costList.addEventListener('input', (e) => {
  const item = e.target.closest('.cost-item');
  if (!item) return;
  const idx = Number(item.dataset.idx);
  if (e.target.classList.contains('ci-icon')) costsState[idx].icon = e.target.value;
  if (e.target.classList.contains('ci-num')) costsState[idx].amount = Number(e.target.value || 0);
  render();
});

flds.costList.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-del');
  if (!btn) return;
  const item = e.target.closest('.cost-item');
  const idx = Number(item.dataset.idx);
  costsState.splice(idx, 1);
  render();
});

// 简易拖拽排序（鼠标按下与释放计算位置）
let dragIdx = null;
flds.costList.addEventListener('mousedown', (e) => {
  const drag = e.target.closest('.drag');
  if (!drag) return;
  const item = drag.parentElement; dragIdx = Number(item.dataset.idx);
});
flds.costList.addEventListener('mouseup', (e) => {
  if (dragIdx === null) return;
  const item = e.target.closest('.cost-item');
  if (item) {
    const dropIdx = Number(item.dataset.idx);
    const [moved] = costsState.splice(dragIdx, 1);
    costsState.splice(dropIdx, 0, moved);
  }
  dragIdx = null; render();
});

// 描述数字强调
function renderDesc() {
  const text = flds.desc.value || '';
  const html = text.replace(/(\d+)/g, '<span class="em">$1</span>');
  els.desc.innerHTML = html;
}

// 草稿保存/加载
const DRAFT_KEY = 'cardDraft_v1';
function autoSave() {
  const data = { uploadedIconUrl, costsState, gen: buildGeneratorJson() };
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch {}
}
flds.btnSave.addEventListener('click', () => { autoSave(); flds.btnSave.textContent = '已保存'; setTimeout(()=> flds.btnSave.textContent='保存草稿', 1200); });
flds.btnLoad.addEventListener('click', () => {
  try {
    const s = localStorage.getItem(DRAFT_KEY);
    if (!s) return;
    const data = JSON.parse(s);
    uploadedIconUrl = data.uploadedIconUrl || null;
    costsState = Array.isArray(data.costsState) ? data.costsState : costsState;
    const g = data.gen || {};
    flds.tag.value = g.tag || flds.tag.value;
    flds.title.value = g.title || flds.title.value;
    flds.desc.value = g.desc || flds.desc.value;
    flds.era.value = g.era ?? flds.era.value;
    flds.energy.value = g.energy ?? flds.energy.value;
    flds.iconEmoji.value = g.iconEmoji || flds.iconEmoji.value;
    flds.theme.value = g.theme || flds.theme.value;
    flds.themeColor.value = g.themeColor || flds.themeColor.value;
    flds.darkMode.checked = !!g.dark;
    render();
  } catch {}
});
flds.btnClear.addEventListener('click', () => {
  uploadedIconUrl = null; costsState = []; flds.tag.value=''; flds.title.value=''; flds.desc.value=''; flds.era.value=0; flds.energy.value=0; flds.iconEmoji.value=''; render();
});

// 初始化
loadSchema().then(render);