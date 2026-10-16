import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

// Integration test: masuk lewat HTTP-semu (app.request), keluar lewat respons.
// Tidak ada port, tidak ada server — CI bisa menjalankan ini tanpa jaringan.
// Setiap test membangun app segar dengan store segar (isolasi penuh antar test).

const JSON_HEADERS = { "content-type": "application/json" };

function post(app: ReturnType<typeof createApp>, body: unknown) {
  return app.request("/api/links", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

test("happy path: buat link → redirect → stats mencatat hit", async () => {
  const app = createApp();

  // 1. create
  const created = await post(app, { url: "https://example.com/halo" });
  assert.equal(created.status, 201);
  const { code } = (await created.json()) as { code: string };
  assert.match(code, /^[a-zA-Z0-9]{5}$/);

  // 2. redirect (dua kali — clicks harus ikut naik)
  const redir1 = await app.request(`/${code}`, { redirect: "manual" });
  assert.equal(redir1.status, 301);
  assert.equal(redir1.headers.get("location"), "https://example.com/halo");
  await app.request(`/${code}`, { redirect: "manual" });

  // 3. stats
  const stats = await app.request(`/api/links/${code}`);
  assert.equal(stats.status, 200);
  const record = (await stats.json()) as { url: string; clicks: number };
  assert.equal(record.url, "https://example.com/halo");
  assert.equal(record.clicks, 2);
});

test("404: kode yang tidak ada", async () => {
  const app = createApp();
  const res = await app.request("/ngawur99");
  assert.equal(res.status, 404);
});

test("400: payload rusak — JSON tidak valid", async () => {
  const app = createApp();
  const res = await app.request("/api/links", {
    method: "POST",
    headers: JSON_HEADERS,
    body: "{url: bukan json",
  });
  assert.equal(res.status, 400);
});

test("400: field url hilang / bukan string", async () => {
  const app = createApp();
  assert.equal((await post(app, {})).status, 400);
  assert.equal((await post(app, { url: 123 })).status, 400);
});

test("400: URL invalid", async () => {
  const app = createApp();
  assert.equal((await post(app, { url: "bukan-url" })).status, 400);
  assert.equal((await post(app, { url: "ftp://bukan-http.com" })).status, 400);
});

test("healthz: 200 + status ok (dan tidak terhitung sebagai redirect)", async () => {
  const app = createApp();
  const res = await app.request("/healthz");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: "ok" });
});
