const els = {
  cardWrap: document.getElementById('cardWrap'),
  card: document.getElementById('card'),
  tag: document.getElementById('cardTag'),
  title: document.getElementById('cardTitle'),
  desc: document.getElementById('cardDesc'),
  costs: document.getElementById('cardCosts'),
  icon: document.getElementById('cardIcon'),
  attrs: document.getElementById('cardAttrs'),
  schemaStatus: document.getElementById('schemaStatus'),
  schemaPanel: document.getElementById('schemaPanel'),
  guideX: document.getElementById('guideX'),
  guideY: document.getElementById('guideY'),
  
  sheetPreview: document.getElementById('sheetPreview'),
  sheetWrap: document.getElementById('sheetWrap'),
  sheetGrid: document.getElementById('sheetGrid'),
};

const flds = {
  tag: document.getElementById('fldTag'),
  title: document.getElementById('fldTitle'),
  desc: document.getElementById('fldDesc'),
  attrsList: document.getElementById('attrsList'),
  btnAddAttr: document.getElementById('btnAddAttr'),
  iconEmoji: document.getElementById('fldIconEmoji'),
  iconUpload: document.getElementById('fldIconUpload'),
  btnIconLibrary: document.getElementById('btnIconLibrary'),
  iconPanel: document.getElementById('iconLibraryPanel'),
  iconGrid: document.getElementById('iconGrid'),
  iconSearch: document.getElementById('fldIconSearch'),
  iconColor: document.getElementById('fldIconColor'),
  btnIconClose: document.getElementById('btnIconClose'),
  costList: document.getElementById('costList'),
  btnAddCost: document.getElementById('btnAddCost'),
  theme: document.getElementById('fldTheme'),
  themeColor: document.getElementById('fldThemeColor'),
  cardBgColor: document.getElementById('fldCardBgColor'),
  cardBgColorHex: document.getElementById('fldCardBgColorHex'),
  cardBgSwatches: document.getElementById('cardBgSwatches'),
  darkMode: document.getElementById('fldDarkMode'),
  btnExportPng: document.getElementById('btnExportPng'),
  btnCopyJson: document.getElementById('btnCopyJson'),
  btnAddToBatch: document.getElementById('btnAddToBatch'),
  btnBatchImport: document.getElementById('btnBatchImport'),
  btnBatchExportZip: document.getElementById('btnBatchExportZip'),
  batchFile: document.getElementById('fldBatchFile'),
  btnSave: document.getElementById('btnSave'),
  btnLoad: document.getElementById('btnLoad'),
  btnClear: document.getElementById('btnClear'),
  tplSelect: document.getElementById('fldTemplateSelect'),
  tplName: document.getElementById('fldTemplateName'),
  btnTplSave: document.getElementById('btnTemplateSave'),
  btnTplApply: document.getElementById('btnTemplateApply'),
  btnTplDelete: document.getElementById('btnTemplateDelete'),
  exportScale: document.getElementById('fldExportScale'),
  exportTransparent: document.getElementById('fldExportTransparent'),
  exportPad: document.getElementById('fldExportPad'),
  // 布局与网格
  showGrid: document.getElementById('fldShowGrid'),
  snapStep: document.getElementById('fldSnapStep'),
  lockDrag: document.getElementById('fldLockDrag'),
  btnResetLayout: document.getElementById('btnResetLayout'),
  // A4 相关
  btnOpenSheet: document.getElementById('btnOpenSheet'),
  btnExportSheetPng: document.getElementById('btnExportSheetPng'),
  btnSheetClose: document.getElementById('btnSheetClose'),
};

let uploadedIconUrl = null;
let costsState = [
  { icon: '🧱', amount: 4 },
  { icon: '⚒', amount: 2 },
];
let attrsState = [];

// 批量与模板状态
let batchData = [];
const TEMPLATES_KEY = 'cardTemplates_v1';
let templates = [];

// 图标库（少量 SVG 示例）
const ICON_SVGS = [
  { name: 'hammer', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2l8 8-2 2-8-8 2-2zM2 22l7-7 2 2-7 7H2v-2z"/></svg>' },
  { name: 'cube', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.2L6 7l6 3.3L18 7l-6-2.8zM5 8.7v7.6l7 3.9v-7.6L5 8.7zm9 3.9v7.6l7-3.9V8.7l-7 3.9z"/></svg>' },
  { name: 'bolt', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 21h-1l1-7H8l7-12h1l-1 7h3l-7 12z"/></svg>' },
  { name: 'leaf', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c6 0 10 4 10 10s-4 10-10 10S2 18 2 12C2 6 6 2 12 2zm0 2C7.6 4 4 7.6 4 12c0 4.4 3.6 8 8 8s8-3.6 8-8c0-3.8-2.7-7-6.3-7.8C13.1 10.9 8.9 15.1 4.2 16.3 5.1 19.9 8.3 22 12 22c5.5 0 10-4.5 10-10 0-5.3-4.2-9.6-9.5-9.9C12.3 2 12.1 2 12 2z"/></svg>' },
  { name: 'sword', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 20l9-9 2 2-9 9H2v-2zm12-10l6-6 2 2-6 6-2-2zM9 13l2 2-4 4H5l4-4z"/></svg>' },
  { name: 'gear', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a4 4 0 110 8 4 4 0 010-8zm8.1 4a8.1 8.1 0 00-.2-1.7l2.1-1.6-2-3.5-2.5 1a8.2 8.2 0 00-3-1.7l-.5-2.7h-4l-.5 2.7a8.2 8.2 0 00-3 1.7l-2.5-1-2 3.5 2.1 1.6a8.1 8.1 0 000 3.4L1 14.3l2 3.5 2.5-1a8.2 8.2 0 003 1.7l.5 2.7h4l.5-2.7a8.2 8.2 0 003-1.7l2.5 1 2-3.5-2.1-1.6c.1-.6.2-1.1.2-1.7z"/></svg>' },
  { name: 'book', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h12a3 3 0 013 3v14H6a2 2 0 00-2 2V3zM6 5v12h11V6a1 1 0 00-1-1H6z"/></svg>' },
  { name: 'shield', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 4v6c0 5-4.5 8.8-8 10-3.5-1.2-8-5-8-10V6l8-4z"/></svg>' },
  { name: 'fire', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s4 3 4 7-3 5-3 7 2 3 2 5c-2 0-6-2-6-6 0-4 3-6 3-8S8 2 12 2z"/></svg>' },
  { name: 'water', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c4 5 8 9 8 13a8 8 0 11-16 0c0-4 4-8 8-13z"/></svg>' },
  { name: 'star', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-3.5L6 22l1.5-8.5L2 9h7l3-7z"/></svg>' },
  { name: 'tower', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12v6l-2 2v12H8V10L6 8V2zm4 8h4v10h-4V10z"/></svg>' },
];
let selectedSvg = null;

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

function setCardBgColor(hex) {
  if (!/^#([0-9a-fA-F]{6})$/.test(hex)) return;
  document.documentElement.style.setProperty('--card-bg', hex);
}

function lightenHex(hex, ratio) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const toHex = v => ('0' + Math.round(v).toString(16)).slice(-2);
  const lr = r + (255 - r) * ratio;
  const lg = g + (255 - g) * ratio;
  const lb = b + (255 - b) * ratio;
  return `#${toHex(lr)}${toHex(lg)}${toHex(lb)}`;
}

function textColorForBg(hex) {
  // 简易亮度判断，保证文字对比度
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160 ? '#374151' : '#ffffff';
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

function renderAttrsEditor() {
  if (!flds.attrsList) return;
  flds.attrsList.innerHTML = attrsState.map((a, idx) => `
    <div class="cost-item" data-idx="${idx}">
      <div class="drag">≡</div>
      <input class="ai-icon" type="text" maxlength="2" value="${a.icon || ''}" />
      <input class="ai-text" type="text" placeholder="文字" value="${a.text || ''}" />
      <input class="ai-color" type="color" value="${a.color || '#eef2ff'}" />
      <button class="btn btn-del" type="button">删除</button>
    </div>
  `).join('');
}

function renderAttrs() {
  if (!els.attrs) return;
  els.attrs.innerHTML = attrsState.map(a => {
    const bg = a.color || '#eef2ff';
    const border = lightenHex(bg, 0.2);
    const tc = textColorForBg(bg);
    const text = a.text ? String(a.text) : '';
    const icon = a.icon ? String(a.icon) : '';
    return `<span class="pill" style="background:${bg};border-color:${border};color:${tc}">${icon} ${text}</span>`;
  }).join('');
}

function render() {
  els.tag.textContent = flds.tag.value || '标签';
  els.title.textContent = flds.title.value || '标题';
  renderDesc();
  // 动态属性渲染
  renderAttrs();

  if (selectedSvg) {
    els.icon.style.backgroundImage = '';
    els.icon.innerHTML = selectedSvg.replace('currentColor', flds.iconColor?.value || '#4f46e5');
  } else if (uploadedIconUrl) {
    els.icon.style.backgroundImage = `url(${uploadedIconUrl})`;
    els.icon.style.backgroundSize = 'cover';
    els.icon.textContent = '';
    els.icon.innerHTML = '';
  } else {
    els.icon.style.backgroundImage = '';
    els.icon.innerHTML = '';
    els.icon.textContent = flds.iconEmoji.value || '🎴';
  }

  renderCosts();
  renderCostListEditor();
  renderAttrsEditor();
  setTheme(flds.theme.value);
  setPrimaryColor(flds.themeColor.value);
  if (flds.cardBgColor) {
    setCardBgColor(flds.cardBgColor.value);
    if (flds.cardBgColorHex && flds.cardBgColorHex.value !== flds.cardBgColor.value) {
      flds.cardBgColorHex.value = flds.cardBgColor.value;
    }
  }
  document.body.classList.toggle('dark', !!flds.darkMode.checked);
  validateSchema();
  autoSave();
  snapshot();
  
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
    iconEmoji: uploadedIconUrl ? null : (flds.iconEmoji.value || ''),
    iconUrl: uploadedIconUrl || null,
    iconSvg: selectedSvg || null,
    costs: costsState.map(c => ({ icon: c.icon, amount: Number(c.amount||0) })),
    attributes: attrsState.map(a => ({ icon: a.icon || '', text: a.text || '', color: a.color || '#eef2ff' })),
    theme: flds.theme.value,
    themeColor: flds.themeColor.value,
    cardBgColor: flds.cardBgColor?.value,
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
    if (typeof Ajv !== 'undefined') {
      ajv = new Ajv({ allErrors: true });
      validate = ajv.compile(schema);
    } else {
      validate = null;
    }
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

// 背景颜色：十六进制与拾色器双向同步
flds.cardBgColorHex?.addEventListener('input', () => {
  const hex = flds.cardBgColorHex.value.trim();
  if (/^#([0-9a-fA-F]{6})$/.test(hex)) {
    if (flds.cardBgColor && flds.cardBgColor.value !== hex) {
      flds.cardBgColor.value = hex;
    }
    setCardBgColor(hex);
  }
});
flds.cardBgColor?.addEventListener('input', () => {
  const hex = flds.cardBgColor.value;
  if (flds.cardBgColorHex && flds.cardBgColorHex.value !== hex) {
    flds.cardBgColorHex.value = hex;
  }
});

// 背景颜色预设色块点击
flds.cardBgSwatches?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-color]');
  if (!btn) return;
  const hex = btn.getAttribute('data-color');
  if (!/^#([0-9a-fA-F]{6})$/.test(hex)) return;
  if (flds.cardBgColor) flds.cardBgColor.value = hex;
  if (flds.cardBgColorHex) flds.cardBgColorHex.value = hex;
  setCardBgColor(hex);
  render();
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

// 属性列表：添加、编辑、删除
flds.btnAddAttr?.addEventListener('click', () => {
  attrsState.push({ icon: '⭐', text: '属性', color: '#eef2ff' });
  render();
});

flds.attrsList?.addEventListener('input', (e) => {
  const item = e.target.closest('.cost-item');
  if (!item) return;
  const idx = Number(item.dataset.idx);
  const cls = e.target.classList;
  if (cls.contains('ai-icon')) attrsState[idx].icon = e.target.value;
  else if (cls.contains('ai-text')) attrsState[idx].text = e.target.value;
  else if (cls.contains('ai-color')) attrsState[idx].color = e.target.value;
  render();
});

flds.attrsList?.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-del');
  if (!btn) return;
  const item = e.target.closest('.cost-item');
  if (!item) return;
  const idx = Number(item.dataset.idx);
  attrsState.splice(idx, 1);
  render();
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
     // 使用新的生成器结构加载（包含动态属性、图标、颜色等）
     applyGeneratorJson(g);
   } catch {}
});
flds.btnClear.addEventListener('click', () => {
  uploadedIconUrl = null; costsState = []; attrsState = []; flds.tag.value=''; flds.title.value=''; flds.desc.value=''; flds.iconEmoji.value=''; render();
});

// 应用生成器 JSON 到表单
function applyGeneratorJson(g) {
  if (!g) return;
  flds.tag.value = g.tag ?? flds.tag.value;
  flds.title.value = g.title ?? flds.title.value;
  flds.desc.value = g.desc ?? flds.desc.value;
  uploadedIconUrl = g.iconUrl || null;
  selectedSvg = g.iconSvg || null;
  flds.iconEmoji.value = g.iconEmoji || flds.iconEmoji.value;
  costsState = Array.isArray(g.costs) ? g.costs.map(c => ({ icon: c.icon, amount: Number(c.amount||0) })) : costsState;
  attrsState = Array.isArray(g.attributes) ? g.attributes.map(a => ({ icon: a.icon || '', text: a.text || '', color: a.color || '#eef2ff' })) : attrsState;
  flds.theme.value = g.theme || flds.theme.value;
  flds.themeColor.value = g.themeColor || flds.themeColor.value;
  if (flds.cardBgColor) {
    flds.cardBgColor.value = g.cardBgColor || flds.cardBgColor.value || '#ffffff';
    if (flds.cardBgColorHex) flds.cardBgColorHex.value = flds.cardBgColor.value;
  }
  flds.darkMode.checked = !!g.dark;
  render();
}

// 批量：加入队列、导入、导出 ZIP
flds.btnAddToBatch?.addEventListener('click', () => {
  batchData.push(buildGeneratorJson());
  flds.btnAddToBatch.textContent = `已加入（${batchData.length}）`;
  setTimeout(() => (flds.btnAddToBatch.textContent = '加入批量队列'), 1200);
});

flds.btnBatchImport?.addEventListener('click', () => {
  flds.batchFile.click();
});

flds.batchFile?.addEventListener('change', async () => {
  const file = flds.batchFile.files?.[0]; if (!file) return;
  const text = await file.text();
  try {
    let arr = [];
    if (file.name.endsWith('.json')) {
      const data = JSON.parse(text);
      arr = Array.isArray(data) ? data : [data];
    } else {
      arr = parseCsv(text);
    }
    batchData = arr;
    alert(`已导入 ${batchData.length} 条记录`);
  } catch (e) {
    alert('导入失败：' + e.message);
  }
});

function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(s => s.trim());
  return lines.slice(1).map(line => {
    const cols = line.split(',');
    const obj = {};
    header.forEach((h, i) => obj[h] = cols[i]);
    // 类型转换
    obj.era = Number(obj.era || 0);
    obj.energy = Number(obj.energy || 0);
    try { obj.costs = JSON.parse(obj.costs || '[]'); } catch { obj.costs = []; }
    return obj;
  });
}

flds.btnBatchExportZip?.addEventListener('click', async () => {
  if (!batchData.length) { alert('请先导入或加入批量队列'); return; }
  await ensureJSZip();
  const zip = new JSZip();
  const scale = Number(flds.exportScale.value || 2);
  const transparent = !!flds.exportTransparent.checked;
  els.cardWrap.style.setProperty('--export-pad', `${Number(flds.exportPad.value || 0)}px`);
  for (let i = 0; i < batchData.length; i++) {
    applyGeneratorJson(batchData[i]);
    await new Promise(r => setTimeout(r, 30));
    const canvas = await html2canvas(els.cardWrap, { backgroundColor: transparent ? null : '#ffffff', scale });
    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.split(',')[1];
    const name = (batchData[i].title || `card_${i+1}`).replace(/[^\w\-\u4e00-\u9fa5]/g,'_');
    zip.file(`${name}.png`, base64, { base64: true });
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `cards_${Date.now()}.zip`;
  link.click();
});

async function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Script load failed: ' + src));
    document.head.appendChild(s);
  });
}

async function ensureJSZip() {
  if (window.JSZip) return;
  try {
    await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
  } catch (_) {
    await loadExternalScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
  }
}

// 模板管理
function ensureDefaultTemplates() {
  const s = localStorage.getItem(TEMPLATES_KEY);
  templates = s ? JSON.parse(s) : [];
  if (!templates.length) {
    templates = [
      { name: '单位', data: { tag: '单位', title: '基础士兵', desc: '攻击 +2', era: 1, energy: 1, costs: [{icon:'⚔',amount:1}] } },
      { name: '科技', data: { tag: '科技', title: '混凝土', desc: '每回合产出 5 材料', era: 2, energy: 3, costs: [{icon:'🧱',amount:4},{icon:'⚒',amount:2}] } },
      { name: '事件', data: { tag: '事件', title: '突袭', desc: '敌方单位受到 2 点伤害', era: 2, energy: 2, costs: [{icon:'⚡',amount:2}] } },
    ];
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }
  refreshTemplateSelect();
}

function refreshTemplateSelect() {
  if (!flds.tplSelect) return;
  flds.tplSelect.innerHTML = templates.map((t, idx) => `<option value="${idx}">${t.name}</option>`).join('');
}

flds.btnTplSave?.addEventListener('click', () => {
  const name = (flds.tplName.value || '').trim(); if (!name) { alert('请输入模板名称'); return; }
  templates.push({ name, data: buildGeneratorJson() });
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  flds.tplName.value = '';
  refreshTemplateSelect();
  alert('模板已保存');
});

flds.btnTplApply?.addEventListener('click', () => {
  const idx = Number(flds.tplSelect.value || 0);
  const tpl = templates[idx]; if (!tpl) return;
  applyGeneratorJson(tpl.data);
});

flds.btnTplDelete?.addEventListener('click', () => {
  const idx = Number(flds.tplSelect.value || 0);
  if (templates[idx]) {
    templates.splice(idx, 1);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    refreshTemplateSelect();
    alert('模板已删除');
  }
});

// 图标库：打开、搜索、选择、颜色
function openIconPanel() { flds.iconPanel.hidden = false; renderIconGrid(); }
function closeIconPanel() { flds.iconPanel.hidden = true; }
function renderIconGrid() {
  const q = (flds.iconSearch.value || '').toLowerCase();
  const color = flds.iconColor.value || '#4f46e5';
  const list = ICON_SVGS.filter(i => i.name.includes(q));
  flds.iconGrid.innerHTML = list.map(i => `<div class="icon-item" data-name="${i.name}">${i.svg.replace('currentColor', color)}</div>`).join('');
}

flds.btnIconLibrary?.addEventListener('click', openIconPanel);
flds.btnIconClose?.addEventListener('click', closeIconPanel);
flds.iconSearch?.addEventListener('input', renderIconGrid);
flds.iconColor?.addEventListener('input', () => { render(); renderIconGrid(); });
flds.iconGrid?.addEventListener('click', (e) => {
  const item = e.target.closest('.icon-item'); if (!item) return;
  const name = item.dataset.name;
  const rec = ICON_SVGS.find(x => x.name === name);
  selectedSvg = rec?.svg || null;
  uploadedIconUrl = null;
  flds.iconEmoji.value = '';
  render();
  closeIconPanel();
});

// 撤销/重做历史
let lastGen = null;
let historyStack = [];
let redoStack = [];
function snapshot() {
  const cur = buildGeneratorJson();
  const curStr = JSON.stringify(cur);
  const lastStr = lastGen ? JSON.stringify(lastGen) : null;
  if (!lastStr || curStr !== lastStr) {
    if (lastGen) historyStack.push(lastGen);
    lastGen = cur;
    redoStack = [];
  }
}

function applySnapshot(s) { applyGeneratorJson(s); lastGen = s; }

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    const s = historyStack.pop(); if (s) { redoStack.push(lastGen); applySnapshot(s); }
  } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
    e.preventDefault();
    const s = redoStack.pop(); if (s) { historyStack.push(lastGen); applySnapshot(s); }
  } else if (e.ctrlKey && e.key.toLowerCase() === 'b') {
    e.preventDefault(); batchData.push(buildGeneratorJson()); }
});

// ---- M3：布局拖拽与吸附、网格控制、A4 预览、平衡建议、PWA ----
let layoutState = {};
let dragCtx = null;

function getSnapStep() {
  const v = Number(flds.snapStep?.value || 0);
  return Number.isFinite(v) ? v : 0;
}

function applyLayoutTransforms() {
  const elsDraggable = els.card.querySelectorAll('.draggable');
  elsDraggable.forEach((el, idx) => {
    const key = el.id || `draggable_${idx}`;
    const pos = layoutState[key];
    if (pos) {
      el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    } else {
      el.style.transform = '';
    }
  });
}

function initLayoutDrag() {
  els.card.addEventListener('mousedown', (e) => {
    const target = e.target.closest('.draggable');
    if (!target) return;
    if (flds.lockDrag?.checked) return;
    e.preventDefault();
    const cardRect = els.card.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const key = target.id || `draggable_${Array.from(els.card.querySelectorAll('.draggable')).indexOf(target)}`;
    const current = layoutState[key] || { x: 0, y: 0 };
    dragCtx = {
      el: target,
      key,
      startX: e.clientX,
      startY: e.clientY,
      baseX: current.x,
      baseY: current.y,
      cardRect,
      tRect,
    };
    target.classList.add('dragging');
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd, { once: true });
  });
}

function onDragMove(e) {
  if (!dragCtx) return;
  const dx = e.clientX - dragCtx.startX;
  const dy = e.clientY - dragCtx.startY;
  let nx = dragCtx.baseX + dx;
  let ny = dragCtx.baseY + dy;
  const step = getSnapStep();
  if (step > 0) {
    nx = Math.round(nx / step) * step;
    ny = Math.round(ny / step) * step;
  }
  layoutState[dragCtx.key] = { x: nx, y: ny };
  dragCtx.el.style.transform = `translate(${nx}px, ${ny}px)`;
  // 中线指引
  const cardRect = dragCtx.cardRect;
  const elRect = dragCtx.el.getBoundingClientRect();
  const elCenterX = elRect.left + elRect.width / 2;
  const elCenterY = elRect.top + elRect.height / 2;
  const cardCenterX = cardRect.left + cardRect.width / 2;
  const cardCenterY = cardRect.top + cardRect.height / 2;
  els.guideX.hidden = Math.abs(elCenterX - cardCenterX) > 3;
  els.guideY.hidden = Math.abs(elCenterY - cardCenterY) > 3;
}

function onDragEnd() {
  if (!dragCtx) return;
  dragCtx.el.classList.remove('dragging');
  els.guideX.hidden = true;
  els.guideY.hidden = true;
  dragCtx = null;
}

function initGridControls() {
  flds.showGrid?.addEventListener('change', () => {
    els.cardWrap.classList.toggle('grid-on', !!flds.showGrid.checked);
  });
  flds.btnResetLayout?.addEventListener('click', () => {
    layoutState = {};
    applyLayoutTransforms();
  });
}

function renderSheet() {
  if (!els.sheetGrid) return;
  els.sheetGrid.innerHTML = '';
  const count = 9; // 简版：3x3
  for (let i = 0; i < count; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'sheet-card';
    const clone = els.card.cloneNode(true);
    clone.querySelectorAll('.dragging').forEach(n => n.classList.remove('dragging'));
    wrap.appendChild(clone);
    els.sheetGrid.appendChild(wrap);
  }
}

function ensureSheetElements() {
  // 兜底：当脚本在弹窗后加载前执行时，运行时再获取一次元素引用
  // 功能已移除：保持空实现以防调用
  els.sheetPreview = null;
  els.sheetWrap = null;
  els.sheetGrid = null;
  flds.btnSheetClose = null;
}

function initSheetPreview() {
  // 功能已移除：不再绑定任何事件
}

// 已移除平衡建议功能

function registerPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}

// 初始化 M3 功能
initLayoutDrag();
initGridControls();
initSheetPreview();
 
registerPWA();

// 初始化
ensureDefaultTemplates();
loadSchema().then(render);