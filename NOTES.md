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

## Day 2 — 16 Okt 2026 — Test yang layak jadi gerbang

**Dibuat:**
- Refactor: `src/app.ts` (createApp, store disuntik) dipisah dari `src/index.ts` (serve) — app bisa diuji tanpa port/jaringan.
- Integration test via `app.request()`: happy path (create→redirect→stats), 404, JSON rusak, url hilang/salah tipe, URL invalid, ftp:// ditolak, healthz.
- `test:ci` = coverage gate: `--experimental-test-coverage --test-coverage-lines=80`.

**Angka:**
- Suite: 13 test / 0.44 dtk (target < 10 dtk ✅).
- Coverage: 90.57% lines, 96.30% branch, 100% funcs — gate 80% lolos.
- Gerbang DIBUKTIKAN bisa merah: threshold 100 → `EXIT CODE = 1` ("90.57% does not meet threshold").

**Keputusan:**
- `fetch` dengan `redirect: "manual"` di test — kalau tidak, fetch mengikuti 301 otomatis dan test tidak bisa melihat header Location.
- Coverage memory.ts 65% (baris 1-8: interface) = artefak type-stripping tsx, bukan kode mati — diketahui, tidak dikejar.

**Pelajaran:**
- Gerbang yang belum pernah terbukti gagal = belum terbukti apa-apa. Uji gerbangnya, bukan cuma jalannya.

