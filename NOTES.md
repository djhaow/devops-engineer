# NOTES — shortlink-api

> Buku kerja harian. Dicatat per Day: apa yang dikerjakan, angka, keputusan, dan pelajaran.

## Day 1 — 16 Okt 2026 — App v0: shortlink in-memory

**Dibuat:**
- shortlink-api v0: Hono + TS strict. Struktur: `id-gen` / `store/memory` / `routes/links` / `index`.
- Endpoint: `POST /api/links` (201), `GET /:code` (301 + Location + hit counter), `GET /api/links/:code` (stats), `/healthz`.
- Unit test: 7 test (id-gen + store), runner `tsx --test`. Suite ±0.4 dtk.

**Keputusan:**
- Charset id-gen base62 minus `l I 1 O 0` — menghindari salah baca/ketik manual.
- Rute `/:code` didaftarkan PALING AKHIR; `/healthz` didaftarkan SEBELUM mount routes — jika tidak keduanya akan ditelan `/:code`.
- Store disuntikkan ke routes via parameter (`linksRoutes(store)`) — supaya tukar Postgres di W3 tidak menyentuh handler.

**Pelajaran (Langkah 0 + Day 1):**
- winget: ID paket bisa berubah/tiada (`Kind.Kind` → `Kubernetes.kind`). Solusi: `winget search <nama>` dulu, jangan percaya dokumentasi lama.
- Windows PATH dibaca SEKALI saat program lahir. Terminal "baru" di dalam app tua (VS Code/WT) tetap warisi PATH tua — tutup aplikasi induknya, bukan tab-nya.
- `tsc` nodenext mewajibkan import ekstensi `.js`, tapi runner TS bawaan Node tidak me-rewrite `.js` → `.ts`. Solusi: runner test pakai `tsx --test`.

**Angka (baseline untuk dibandingkan nanti):**
- Test suite: 7 test / 0.4 dtk.
- [isi nanti W2 Day 5: ukuran image versi naif]
