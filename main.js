// main.ts (lühem, sama funktsionaalsus)
const STORAGE_KEY = "products_v1";
const STATUS_LABEL = {
    OUT: "Otsas",
    LOW: "Vähene",
    OK: "Piisav",
};
const statusRank = (s) => (s === "OUT" ? 0 : s === "LOW" ? 1 : 2);
const safeJsonParse = (raw) => {
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
};
const getStockStatus = (p) => p.quantity <= 0 ? "OUT" : p.quantity < p.minStock ? "LOW" : "OK";
const newId = () => "p_" + Math.random().toString(16).slice(2) + "_" + Date.now();
const isProduct = (x) => !!x &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.name === "string" &&
    typeof x.quantity === "number" &&
    typeof x.minStock === "number" &&
    typeof x.createdAt === "number";
const loadProducts = () => {
    const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed.filter(isProduct) : [];
};
const saveProducts = (products) => localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
class ProductStore {
    constructor(products) {
        this.products = products;
    }
    getAll() { return [...this.products]; }
    commit(next) {
        this.products = next;
        saveProducts(this.products);
    }
    add(product) {
        const created = { ...product, id: newId(), createdAt: Date.now() };
        this.commit([created, ...this.products]);
        return created;
    }
    update(id, patch) {
        this.commit(this.products.map(p => (p.id === id ? { ...p, ...patch } : p)));
    }
    remove(id) { this.commit(this.products.filter(p => p.id !== id)); }
    clearAll() { this.commit([]); }
}
const applyView = (products, s) => {
    const q = s.query.trim().toLowerCase();
    const dir = s.sortDir === "asc" ? 1 : -1;
    const key = (p) => s.sortKey === "status" ? statusRank(getStockStatus(p))
        : s.sortKey === "name" ? p.name.toLowerCase()
            : p[s.sortKey];
    return products
        .filter(p => !q || p.name.toLowerCase().includes(q))
        .filter(p => s.statusFilter === "ALL" || getStockStatus(p) === s.statusFilter)
        .slice()
        .sort((a, b) => {
        const ka = key(a), kb = key(b);
        const res = typeof ka === "number" && typeof kb === "number"
            ? ka - kb
            : String(ka).localeCompare(String(kb), "et");
        return res * dir;
    });
};
// ---------- DOM helpers ----------
function el(tag, opts = {}, children = []) {
    const n = document.createElement(tag);
    if (opts.className)
        n.className = opts.className;
    if (opts.text != null)
        n.textContent = opts.text;
    if (opts.attr)
        Object.entries(opts.attr).forEach(([k, v]) => n.setAttribute(k, v));
    children.forEach(c => n.appendChild(c));
    return n;
}
const addStyle = (css) => document.head.appendChild(el("style", { text: css }));
function labeled(label, input) {
    return el("div", {}, [el("label", { text: label }), input]);
}
function select(options, value) {
    const s = el("select");
    options.forEach(o => s.appendChild(el("option", { attr: { value: o.v }, text: o.t })));
    s.value = value;
    return s;
}
function bindNonNegIntInput(input, getFallback, onValid, rerender) {
    input.addEventListener("change", () => {
        const v = Number(input.value);
        if (Number.isFinite(v) && v >= 0)
            onValid(Math.floor(v));
        else
            input.value = String(getFallback());
        rerender();
    });
}
function setAppStyles() {
    addStyle(`
    :root { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; }
    body { margin: 0; background: #0b1220; color: #e6eefc; }
    .wrap { max-width: 1000px; margin: 0 auto; padding: 20px; }
    .card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 16px; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; align-items: end; }
    label { font-size: 12px; opacity: 0.9; display: block; margin-bottom: 6px; }
    input, select, button { border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.25); color: inherit; padding: 10px; }
    input::placeholder { color: rgba(230,238,252,0.6); }
    button { cursor: pointer; }
    button.primary { background: rgba(87,155,255,0.25); border-color: rgba(87,155,255,0.45); }
    button.danger { background: rgba(255,87,87,0.18); border-color: rgba(255,87,87,0.35); }
    .grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 10px; align-items: center; }
    .header { font-size: 12px; opacity: 0.8; }
    .pill { padding: 6px 10px; border-radius: 999px; font-size: 12px; display: inline-block; border: 1px solid rgba(255,255,255,0.15); }
    .pill.ok { background: rgba(80, 200, 120, 0.18); }
    .pill.low { background: rgba(255, 200, 0, 0.18); }
    .pill.out { background: rgba(255, 87, 87, 0.18); }
    .muted { opacity: 0.8; }
    .error { color: #ffb3b3; font-size: 12px; margin-top: 8px; }
    .top { display:flex; justify-content:space-between; align-items:center; gap: 12px; flex-wrap: wrap; }
    .title { font-size: 18px; font-weight: 700; }
    .small { font-size: 12px; opacity: 0.85; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  `);
}
function renderApp(root, store) {
    setAppStyles();
    const state = { query: "", statusFilter: "ALL", sortKey: "createdAt", sortDir: "desc" };
    const nameInput = el("input", { attr: { placeholder: "Toote nimi", type: "text" } });
    const qtyInput = el("input", { attr: { placeholder: "Kogus", type: "number", min: "0", step: "1" } });
    const minInput = el("input", { attr: { placeholder: "Miinimum", type: "number", min: "0", step: "1" } });
    const addBtn = el("button", { className: "primary", text: "Lisa toode" });
    const clearBtn = el("button", { className: "danger", text: "Tühjenda kõik" });
    const formError = el("div", { className: "error" });
    const searchInput = el("input", { attr: { placeholder: "Otsi nime järgi…", type: "text" } });
    const statusSelect = select([
        { v: "ALL", t: "Kõik" },
        { v: "OK", t: "Piisav" },
        { v: "LOW", t: "Vähene" },
        { v: "OUT", t: "Otsas" },
    ], "ALL");
    const sortKeySelect = select([
        { v: "createdAt", t: "Lisamise aeg" },
        { v: "name", t: "Nimi" },
        { v: "quantity", t: "Kogus" },
        { v: "status", t: "Staatus" },
    ], state.sortKey);
    const sortDirSelect = select([
        { v: "desc", t: "Kahanev" },
        { v: "asc", t: "Kasvav" },
    ], state.sortDir);
    const form = el("div", { className: "card" }, [
        el("div", { className: "top" }, [
            el("div", {}, [
                el("div", { className: "title", text: "Laoseisu rakendus (TypeScript)" }),
                el("div", { className: "small muted", text: "Dünaamiline DOM • Filter/Sorteerimine • LocalStorage" }),
            ]),
            el("div", { className: "row" }, [clearBtn]),
        ]),
        el("div", { className: "row", attr: { style: "margin-top: 14px;" } }, [
            labeled("Nimi", nameInput),
            labeled("Kogus", qtyInput),
            labeled("Miinimum (LOW kui kogus < miinimum)", minInput),
            addBtn,
        ]),
        formError,
    ]);
    const controls = el("div", { className: "card", attr: { style: "margin-top: 14px;" } }, [
        el("div", { className: "row" }, [
            labeled("Otsing", searchInput),
            labeled("Staatus", statusSelect),
            labeled("Sorteeri", sortKeySelect),
            labeled("Suund", sortDirSelect),
        ]),
    ]);
    const listCard = el("div", { className: "card", attr: { style: "margin-top: 14px;" } });
    const listBody = el("div");
    const statsLine = el("div", { className: "small muted", attr: { style: "margin-top: 10px;" } });
    listCard.append(el("div", { className: "grid header", attr: { style: "margin-bottom: 10px;" } }, [
        el("div", { text: "Toode" }),
        el("div", { text: "Kogus" }),
        el("div", { text: "Miinimum" }),
        el("div", { text: "Staatus" }),
        el("div", { text: "Tegevus" }),
    ]), listBody, statsLine);
    root.appendChild(el("div", { className: "wrap" }, [form, controls, listCard]));
    const setError = (msg) => (formError.textContent = msg);
    const render = () => {
        const products = store.getAll();
        const viewed = applyView(products, state);
        const counts = products.reduce((acc, p) => {
            acc.total++;
            acc[getStockStatus(p)]++;
            return acc;
        }, { total: 0, OK: 0, LOW: 0, OUT: 0 });
        statsLine.textContent =
            `Kokku: ${counts.total} • Piisav: ${counts.OK} • Vähene: ${counts.LOW} • Otsas: ${counts.OUT} • Näitan: ${viewed.length}`;
        listBody.innerHTML = "";
        if (!viewed.length) {
            listBody.appendChild(el("div", { className: "muted", text: "Pole midagi näidata (muuda filtreid või lisa toode)." }));
            return;
        }
        viewed.forEach(p => {
            const status = getStockStatus(p);
            const qtyEdit = el("input", { attr: { type: "number", min: "0", step: "1", value: String(p.quantity) } });
            const minEdit = el("input", { attr: { type: "number", min: "0", step: "1", value: String(p.minStock) } });
            bindNonNegIntInput(qtyEdit, () => p.quantity, v => store.update(p.id, { quantity: v }), render);
            bindNonNegIntInput(minEdit, () => p.minStock, v => store.update(p.id, { minStock: v }), render);
            const delBtn = el("button", { className: "danger", text: "Kustuta" });
            delBtn.addEventListener("click", () => { store.remove(p.id); render(); });
            listBody.appendChild(el("div", { className: "grid", attr: { style: "padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.10);" } }, [
                el("div", {}, [
                    el("div", { text: p.name }),
                    el("div", { className: "small muted", text: new Date(p.createdAt).toLocaleString("et-EE") }),
                ]),
                qtyEdit,
                minEdit,
                el("span", {
                    className: "pill " + (status === "OK" ? "ok" : status === "LOW" ? "low" : "out"),
                    text: STATUS_LABEL[status],
                }),
                delBtn,
            ]));
        });
    };
    // events
    addBtn.addEventListener("click", () => {
        setError("");
        const name = nameInput.value.trim();
        const quantity = Number(qtyInput.value);
        const minStock = Number(minInput.value);
        if (!name)
            return setError("Palun sisesta toote nimi.");
        if (!Number.isFinite(quantity) || quantity < 0)
            return setError("Kogus peab olema 0 või suurem arv.");
        if (!Number.isFinite(minStock) || minStock < 0)
            return setError("Miinimum peab olema 0 või suurem arv.");
        store.add({ name, quantity: Math.floor(quantity), minStock: Math.floor(minStock) });
        nameInput.value = "";
        qtyInput.value = "";
        minInput.value = "";
        render();
    });
    clearBtn.addEventListener("click", () => {
        if (confirm("Kas oled kindel, et soovid kõik tooted kustutada?")) {
            store.clearAll();
            render();
        }
    });
    searchInput.addEventListener("input", () => { state.query = searchInput.value; render(); });
    statusSelect.addEventListener("change", () => { state.statusFilter = statusSelect.value; render(); });
    sortKeySelect.addEventListener("change", () => { state.sortKey = sortKeySelect.value; render(); });
    sortDirSelect.addEventListener("change", () => { state.sortDir = sortDirSelect.value; render(); });
    render();
}
// bootstrap
const root = document.getElementById("app");
if (!root)
    throw new Error("Puudub #app element");
const demoIfEmpty = (items) => items.length ? items : [
    { id: newId(), name: "Piim", quantity: 2, minStock: 3, createdAt: Date.now() - 3600000 },
    { id: newId(), name: "Leib", quantity: 0, minStock: 2, createdAt: Date.now() - 1800000 },
    { id: newId(), name: "Õunad", quantity: 10, minStock: 5, createdAt: Date.now() - 600000 },
];
const store = new ProductStore(demoIfEmpty(loadProducts()));
saveProducts(store.getAll());
renderApp(root, store);
