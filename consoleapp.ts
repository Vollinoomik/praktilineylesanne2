type Currency = "EUR";

interface Supplier {
  id: string;
  name: string;
}

interface WarehouseStock {
  warehouseId: string;
  qty: number;
}

interface Review {
  productId: string;
  rating: number; 
}

type Specs = Record<string, string>;

interface Product {
  id: string;
  name: string;
  category: string;
  supplierId: string;
  price: number;
  currency: Currency;
  stockByWarehouse: WarehouseStock[];
  specs?: Specs;
}

interface DiscountRule {
  category: string;
  percentOff: number;
  minRating?: number;
}

/*-------------------- DATA -------------------- */

const suppliers: Supplier[] = [
  { id: "sup-nordic", name: "Nordic Devices" },
  { id: "sup-euro", name: "Euro Accessories" },
  { id: "sup-baltic", name: "Baltic Books" },
];

const products: Product[] = [
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

const reviews: Review[] = [
  { productId: "LAP-DEL-XPS15", rating: 4 },
  { productId: "LAP-DEL-XPS15", rating: 5 },
  { productId: "ACC-LOG-MX3", rating: 5 },
  { productId: "ACC-LOG-MX3", rating: 4 },
  { productId: "ACC-LOG-MX3", rating: 5 },
  { productId: "BOOK-TS-BASICS", rating: 3 },
];

const discountRules: DiscountRule[] = [
  { category: "Electronics", percentOff: 10, minRating: 4.0 },
  { category: "Accessories", percentOff: 15 },
  { category: "Books", percentOff: 5, minRating: 4.0 },
];

/* -------------------- RULES / HELPERS -------------------- */

type StockStatus = "OUT" | "LOW" | "IN_STOCK";

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function money(n: number): string {
  return round2(n).toFixed(2);
}

function availableQty(stocks: WarehouseStock[]): number {
  return stocks.reduce((sum, s) => sum + s.qty, 0);
}

function stockStatus(available: number): StockStatus {
  if (available === 0) return "OUT";
  if (available <= 2) return "LOW";
  return "IN_STOCK";
}

function avgRating(productId: string): number | null {
  const rs = reviews.filter((r) => r.productId === productId);
  if (rs.length === 0) return null;
  return rs.reduce((sum, r) => sum + r.rating, 0) / rs.length;
}

function supplierName(supplierId: string): string {
  return suppliers.find((s) => s.id === supplierId)?.name ?? "Unknown";
}

function ruleFor(category: string): DiscountRule | null {
  return discountRules.find((r) => r.category === category) ?? null;
}

function discountApplies(rule: DiscountRule, rating: number | null): boolean {
  if (rule.minRating === undefined) return true;
  return rating !== null && rating >= rule.minRating;
}

function discountedPrice(base: number, rule: DiscountRule): number {
  return round2(base * (1 - rule.percentOff / 100));
}

function specsPart(specs?: Specs): string {
  if (!specs) return "";
  const pairs = Object.entries(specs).map(([k, v]) => `${k}=${v}`).join(", ");
  return ` | specs: ${pairs}`;
}

function ratingText(rating: number | null): string {
  return rating === null ? "no reviews" : money(rating);
}

/* -------------------- REPORT -------------------- */

function printReport(): void {
  console.log("Products:");
  console.log("");

  for (const p of products) {
    const available = availableQty(p.stockByWarehouse);
    const status = stockStatus(available);
    const rating = avgRating(p.id);
    const rule = ruleFor(p.category);

    const basePriceText = money(p.price);

    let priceText = `price: ${basePriceText}`;
    if (rule && discountApplies(rule, rating)) {
      priceText = `price: ${basePriceText} -> ${money(discountedPrice(p.price, rule))}`;
    }

    const line =
      `- ${p.name} [${p.id}] | ${p.category} | supplier: ${supplierName(p.supplierId)} | ` +
      `available: ${available} (${status}) | rating: ${ratingText(rating)}` +
      `${specsPart(p.specs)} | ${priceText}`;

    console.log(line);
  }
}

printReport();