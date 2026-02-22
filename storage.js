/* storage.js — localStorage helpers */
const Storage = {
    get(key, def = null) {
        try {
            const v = localStorage.getItem(key);
            return v !== null ? JSON.parse(v) : def;
        } catch { return def; }
    },
    set(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch { }
    },
    update(key, def, fn) {
        const cur = this.get(key, def);
        const next = fn(cur);
        this.set(key, next);
        return next;
    }
};
