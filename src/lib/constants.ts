export const BASE_URL = "https://singleclik.com/api/public";

export const STORAGE_BASE = "https://singleclik.com/api/storage/app/public";

export const NO_IMAGE = `${STORAGE_BASE}/no_image.jpg`;

export function storageImage(folder: string, file?: string | null): string {
  return file ? `${STORAGE_BASE}/${folder}/${file}` : NO_IMAGE;
}

export const TOKEN_KEY = "token";
