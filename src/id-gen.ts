import { randomInt } from "node:crypto";

// Base62 minus karakter yang mudah tertukar saat dibaca/diketik manual:
// tidak ada l, I, 1, O, 0. Keputusan kecil, dampak besar kalau user salah ketik.
const CHARSET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateId(length = 5): string {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += CHARSET.charAt(randomInt(CHARSET.length));
  }
  return id;
}
