import assets from "./assets.json";
export function resolveDefaultAssets(value) {
  if (Array.isArray(value)) return value.map(resolveDefaultAssets);
  if (value && typeof value === "object") {
    if (value._localAsset) return assets[value._localAsset] || undefined;
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, resolveDefaultAssets(v)]),
    );
  }
  return value;
}
