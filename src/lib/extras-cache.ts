import { getVentifyProducts, Product } from "./ventify";

let cache: Product[] | null = null;
let promise: Promise<void> | null = null;

export function loadExtras(callback: (extras: Product[]) => void): void {
  if (cache) {
    callback(cache);
    return;
  }
  if (promise) {
    promise.then(() => {
      if (cache) callback(cache);
    });
    return;
  }
  promise = getVentifyProducts().then((allProducts) => {
    cache = allProducts.filter(
      (p) =>
        p.categoriaOriginal?.toLowerCase().includes("extras") ||
        p.sku.startsWith("Extra-")
    );
    callback(cache);
  });
}
