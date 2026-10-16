import { test } from "node:test";
import assert from "node:assert/strict";
import { generateId } from "../src/id-gen.js";

test("panjang id sesuai parameter", () => {
  assert.equal(generateId().length, 5);
  assert.equal(generateId(8).length, 8);
});

test("hanya berisi karakter dari charset yang diizinkan", () => {
  const allowed = new Set("abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789");
  for (const ch of generateId(200)) {
    assert.ok(allowed.has(ch), `karakter ilegal: ${ch}`);
  }
});

test("10.000 id — tidak ada duplikat", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 10_000; i++) seen.add(generateId());
  assert.equal(seen.size, 10_000);
});
