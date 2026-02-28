/*-------------------- DATA -------------------- */
var suppliers = [
    { id: "sup-nordic", name: "Nordic Devices" },
    { id: "sup-euro", name: "Euro Accessories" },
    { id: "sup-baltic", name: "Baltic Books" },
];
var products = [
    {
        id: "LAP-DEL-XPS15",
        name: "Dell XPS 15",
        category: "Electronics",
        supplierId: "sup-nordic",
        price: 1299.99,
        currency: "EUR",
        stockByWarehouse: [
            { warehouseId: "w1", qty: 1 },
            { warehouseId: "w2", qty: 2 },
        ],
        specs: { cpu: "Intel i7", ram: "16", storage: "512", weight: "1.8" },
    },
    {
        id: "ACC-LOG-MX3",
        name: "Logitech MX Master 3S",
        category: "Accessories",
        supplierId: "sup-euro",
        price: 99.5,
        currency: "EUR",
        stockByWarehouse: [{ warehouseId: "w1", qty: 9 }],
    },
    {
        id: "BOOK-TS-BASICS",
        name: "TypeScript for Beginners",
        category: "Books",
        supplierId: "sup-baltic",
        price: 39.9,
        currency: "EUR",
        stockByWarehouse: [{ warehouseId: "w2", qty: 1 }],
        specs: { pages: "320", language: "EN" },
    },
    {
        id: "ACC-USB-C-HUB",
        name: "USB-C Hub 8-in-1",
        category: "Accessories",
        supplierId: "sup-euro",
        price: 59.0,
        currency: "EUR",
        stockByWarehouse: [{ warehouseId: "w3", qty: 0 }],
        specs: { ports: "8", usbVersion: "USB 3.2" },
    },
];
var reviews = [
    { productId: "LAP-DEL-XPS15", rating: 4 },
    { productId: "LAP-DEL-XPS15", rating: 5 },
    { productId: "ACC-LOG-MX3", rating: 5 },
    { productId: "ACC-LOG-MX3", rating: 4 },
    { productId: "ACC-LOG-MX3", rating: 5 },
    { productId: "BOOK-TS-BASICS", rating: 3 },
];
var discountRules = [
    { category: "Electronics", percentOff: 10, minRating: 4.0 },
    { category: "Accessories", percentOff: 15 },
    { category: "Books", percentOff: 5, minRating: 4.0 },
];
function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}
function money(n) {
    return round2(n).toFixed(2);
}
function availableQty(stocks) {
    return stocks.reduce(function (sum, s) { return sum + s.qty; }, 0);
}
function stockStatus(available) {
    if (available === 0)
        return "OUT";
    if (available <= 2)
        return "LOW";
    return "IN_STOCK";
}
function avgRating(productId) {
    var rs = reviews.filter(function (r) { return r.productId === productId; });
    if (rs.length === 0)
        return null;
    return rs.reduce(function (sum, r) { return sum + r.rating; }, 0) / rs.length;
}
function supplierName(supplierId) {
    var _a, _b;
    return (_b = (_a = suppliers.find(function (s) { return s.id === supplierId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Unknown";
}
function ruleFor(category) {
    var _a;
    return (_a = discountRules.find(function (r) { return r.category === category; })) !== null && _a !== void 0 ? _a : null;
}
function discountApplies(rule, rating) {
    if (rule.minRating === undefined)
        return true;
    return rating !== null && rating >= rule.minRating;
}
function discountedPrice(base, rule) {
    return round2(base * (1 - rule.percentOff / 100));
}
function specsPart(specs) {
    if (!specs)
        return "";
    var pairs = Object.entries(specs).map(function (_a) {
        var k = _a[0], v = _a[1];
        return "".concat(k, "=").concat(v);
    }).join(", ");
    return " | specs: ".concat(pairs);
}
function ratingText(rating) {
    return rating === null ? "no reviews" : money(rating);
}
/* -------------------- REPORT -------------------- */
function printReport() {
    console.log("Products:");
    console.log("");
    for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
        var p = products_1[_i];
        var available = availableQty(p.stockByWarehouse);
        var status_1 = stockStatus(available);
        var rating = avgRating(p.id);
        var rule = ruleFor(p.category);
        var basePriceText = money(p.price);
        var priceText = "price: ".concat(basePriceText);
        if (rule && discountApplies(rule, rating)) {
            priceText = "price: ".concat(basePriceText, " -> ").concat(money(discountedPrice(p.price, rule)));
        }
        var line = "- ".concat(p.name, " [").concat(p.id, "] | ").concat(p.category, " | supplier: ").concat(supplierName(p.supplierId), " | ") +
            "available: ".concat(available, " (").concat(status_1, ") | rating: ").concat(ratingText(rating)) +
            "".concat(specsPart(p.specs), " | ").concat(priceText);
        console.log(line);
    }
}
printReport();
