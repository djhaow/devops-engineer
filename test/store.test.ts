import { test } from "node:test";
import assert from "node:assert/strict";
import { createMemoryStore } from "../src/store/memory.js";

test("create lalu find — ketemu, field lengkap", () => {
  const store = createMemoryStore();
  store.create("https://example.com", "abc12");

  const found = store.find("abc12");
  assert.equal(found?.url, "https://example.com");
  assert.equal(found?.clicks, 0);
  assert.ok(found?.createdAt instanceof Date);
});

test("find kode ngawur — undefined", () => {
  const store = createMemoryStore();
  assert.equal(store.find("ngawur"), undefined);
});

test("recordHit menaikkan clicks (3x panggil = 3)", () => {
  const store = createMemoryStore();
  store.create("https://example.com", "abc12");

  store.recordHit("abc12");
  store.recordHit("abc12");
  store.recordHit("abc12");

  assert.equal(store.find("abc12")?.clicks, 3);
});

test("recordHit pada kode yang tidak ada — diam, tidak error", () => {
  const store = createMemoryStore();
  store.recordHit("tidak-ada");
  assert.equal(store.find("tidak-ada"), undefined);
});
