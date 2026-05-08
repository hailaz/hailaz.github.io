/**
 * IndexedDB 持久化
 *
 * 对象存储结构：
 *   store 'projects'
 *     key: '__current__'       → 最近工程（快速恢复）
 *     key: 'proj_<id>'         → 具名工程槽位
 *   store 'meta'
 *     key: 'projects-index'    → 所有工程元数据列表（id / name / updatedAt / thumbnail）
 */

const DB_NAME = 'ui-design-guide';
const DB_VERSION = 2;
const STORE = 'projects';
const META_STORE = 'meta';
const CURRENT_KEY = '__current__';
const INDEX_KEY = 'projects-index';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE))      db.createObjectStore(STORE);
      if (!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function tx(db, storeNames, mode, fn) {
  return new Promise((res, rej) => {
    const t = db.transaction(storeNames, mode);
    const stores = {};
    (Array.isArray(storeNames) ? storeNames : [storeNames]).forEach(s => { stores[s] = t.objectStore(s); });
    let result;
    try { result = fn(stores); } catch (e) { rej(e); return; }
    t.oncomplete = () => { db.close(); res(result); };
    t.onerror    = () => { db.close(); rej(t.error); };
  });
}

/* ============ 当前工程（快速恢复） ============ */
export async function saveCurrent(project) {
  try {
    const db = await openDB();
    await tx(db, STORE, 'readwrite', s => { s[STORE].put(project, CURRENT_KEY); });
  } catch (e) { console.warn('[persist] saveCurrent failed', e); }
}

export async function loadCurrent() {
  try {
    const db = await openDB();
    return await new Promise((res, rej) => {
      const t = db.transaction(STORE, 'readonly');
      const r = t.objectStore(STORE).get(CURRENT_KEY);
      r.onsuccess = () => { db.close(); res(r.result || null); };
      r.onerror   = () => { db.close(); rej(r.error); };
    });
  } catch (e) { console.warn('[persist] loadCurrent failed', e); return null; }
}

export async function clearAll() {
  try {
    const db = await openDB();
    await tx(db, [STORE, META_STORE], 'readwrite', s => {
      s[STORE].clear(); s[META_STORE].clear();
    });
  } catch (e) { console.warn('[persist] clearAll failed', e); }
}

/* ============ 多工程槽位 ============ */
export async function saveProjectSlot(project, thumbnail = null) {
  if (!project?.meta?.id) project.meta = { ...(project.meta||{}), id: `proj_${Date.now()}` };
  const id = project.meta.id;
  const db = await openDB();
  await tx(db, [STORE, META_STORE], 'readwrite', s => {
    s[STORE].put(project, id);
    // 更新索引
    const req = s[META_STORE].get(INDEX_KEY);
    req.onsuccess = () => {
      const list = Array.isArray(req.result) ? req.result : [];
      const idx = list.findIndex(x => x.id === id);
      const entry = {
        id,
        name: project.meta.name || 'untitled',
        updatedAt: Date.now(),
        platform: project.meta.platform || 'wechat-miniprogram',
        pagesCount: (project.pages || []).length,
        thumbnail: thumbnail || (idx >= 0 ? list[idx].thumbnail : null),
      };
      if (idx >= 0) list[idx] = entry; else list.push(entry);
      s[META_STORE].put(list, INDEX_KEY);
    };
  });
  return id;
}

export async function loadProjectSlot(id) {
  const db = await openDB();
  return await new Promise((res, rej) => {
    const t = db.transaction(STORE, 'readonly');
    const r = t.objectStore(STORE).get(id);
    r.onsuccess = () => { db.close(); res(r.result || null); };
    r.onerror   = () => { db.close(); rej(r.error); };
  });
}

export async function listProjectSlots() {
  try {
    const db = await openDB();
    return await new Promise((res) => {
      const t = db.transaction(META_STORE, 'readonly');
      const r = t.objectStore(META_STORE).get(INDEX_KEY);
      r.onsuccess = () => { db.close(); res(Array.isArray(r.result) ? r.result : []); };
      r.onerror   = () => { db.close(); res([]); };
    });
  } catch (e) { return []; }
}

export async function deleteProjectSlot(id) {
  const db = await openDB();
  await tx(db, [STORE, META_STORE], 'readwrite', s => {
    s[STORE].delete(id);
    const req = s[META_STORE].get(INDEX_KEY);
    req.onsuccess = () => {
      const list = (Array.isArray(req.result) ? req.result : []).filter(x => x.id !== id);
      s[META_STORE].put(list, INDEX_KEY);
    };
  });
}

/* ============ 自动保存（debounce） ============ */
let tid = null;
export function autosave(project) {
  if (tid) clearTimeout(tid);
  tid = setTimeout(() => saveCurrent(project), 500);
}
