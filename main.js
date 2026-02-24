const STORAGE_KEY = "products";
let products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
function status(p) {const STORAGE_KEY = "products";
let products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
function status(p) {
    if (p.quantity <= 0)
        return "Otsas";
    if (p.quantity < p.min)
        return "Vähene";
    return "Piisav";
}
function render() {
    list.innerHTML = "";
    let filtered = products.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()));
    if (filter.value !== "ALL") {
        filtered = filtered.filter(p => status(p) === filter.value);
    }
    filtered.sort((a, b) => sortDir.value === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name));
    filtered.forEach(p => {
        const row = document.createElement("div");
        row.innerHTML = `
      <strong>${p.name}</strong> |
      Kogus: ${p.quantity} |
      Min: ${p.min} |
      Staatus: ${status(p)}
      <button data-id="${p.id}">X</button>
    `;
        row.querySelector("button").onclick = () => {
            products = products.filter(x => x.id !== p.id);
            save();
            render();
        };
        list.appendChild(row);
    });
}
const app = document.getElementById("app");
const nameInput = document.createElement("input");
nameInput.placeholder = "Nimi";
const qtyInput = document.createElement("input");
qtyInput.type = "number";
qtyInput.placeholder = "Kogus";
const minInput = document.createElement("input");
minInput.type = "number";
minInput.placeholder = "Miinimum";
const addBtn = document.createElement("button");
addBtn.textContent = "Lisa";
const search = document.createElement("input");
search.placeholder = "Otsi";
const filter = document.createElement("select");
["ALL", "Piisav", "Vähene", "Otsas"].forEach(s => {
    const o = document.createElement("option");
    o.value = s;
    o.textContent = s;
    filter.appendChild(o);
});
const sortDir = document.createElement("select");
["asc", "desc"].forEach(s => {
    const o = document.createElement("option");
    o.value = s;
    o.textContent = s;
    sortDir.appendChild(o);
});
const list = document.createElement("div");
addBtn.onclick = () => {
    const name = nameInput.value.trim();
    const quantity = Number(qtyInput.value);
    const min = Number(minInput.value);
    if (!name || quantity < 0 || min < 0)
        return alert("Vale sisend!");
    products.push({
        id: Date.now().toString(),
        name,
        quantity,
        min
    });
    save();
    render();
    nameInput.value = "";
    qtyInput.value = "";
    minInput.value = "";
};
search.oninput = render;
filter.onchange = render;
sortDir.onchange = render;
app.append(nameInput, qtyInput, minInput, addBtn, document.createElement("hr"), search, filter, sortDir, document.createElement("hr"), list);
render();

    if (p.quantity <= 0)
        return "Otsas";
    if (p.quantity < p.min)
        return "Vähene";
    return "Piisav";
}
function render() {
    list.innerHTML = "";
    let filtered = products.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()));
    if (filter.value !== "ALL") {
        filtered = filtered.filter(p => status(p) === filter.value);
    }
    filtered.sort((a, b) => sortDir.value === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name));
    filtered.forEach(p => {
        const row = document.createElement("div");
        row.innerHTML = `
      <strong>${p.name}</strong> |
      Kogus: ${p.quantity} |
      Min: ${p.min} |
      Staatus: ${status(p)}
      <button data-id="${p.id}">X</button>
    `;
        row.querySelector("button").onclick = () => {
            products = products.filter(x => x.id !== p.id);
            save();
            render();
        };
        list.appendChild(row);
    });
}
const app = document.getElementById("app");
const nameInput = document.createElement("input");
nameInput.placeholder = "Nimi";
const qtyInput = document.createElement("input");
qtyInput.type = "number";
qtyInput.placeholder = "Kogus";
const minInput = document.createElement("input");
minInput.type = "number";
minInput.placeholder = "Miinimum";
const addBtn = document.createElement("button");
addBtn.textContent = "Lisa";
const search = document.createElement("input");
search.placeholder = "Otsi";
const filter = document.createElement("select");
["ALL", "Piisav", "Vähene", "Otsas"].forEach(s => {
    const o = document.createElement("option");
    o.value = s;
    o.textContent = s;
    filter.appendChild(o);
});
const sortDir = document.createElement("select");
["asc", "desc"].forEach(s => {
    const o = document.createElement("option");
    o.value = s;
    o.textContent = s;
    sortDir.appendChild(o);
});
const list = document.createElement("div");
addBtn.onclick = () => {
    const name = nameInput.value.trim();
    const quantity = Number(qtyInput.value);
    const min = Number(minInput.value);
    if (!name || quantity < 0 || min < 0)
        return alert("Vale sisend!");
    products.push({
        id: Date.now().toString(),
        name,
        quantity,
        min
    });
    save();
    render();
    nameInput.value = "";
    qtyInput.value = "";
    minInput.value = "";
};
search.oninput = render;
filter.onchange = render;
sortDir.onchange = render;
app.append(nameInput, qtyInput, minInput, addBtn, document.createElement("hr"), search, filter, sortDir, document.createElement("hr"), list);
render();

