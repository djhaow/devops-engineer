import { Hono } from "hono";
import type { LinkStore } from "../store/memory.js";
import { generateId } from "../id-gen.js";

// Store disuntikkan (dependency injection) — handler tidak peduli
// itu Map di memori atau Postgres. W3 tinggal ganti implementasinya.
export function linksRoutes(store: LinkStore) {
  const app = new Hono();

  app.get("/api/links/:code", (c) => {
    const record = store.find(c.req.param("code"));
    if (!record) return c.json({ error: "link tidak ditemukan" }, 404);
    return c.json({ url: record.url, clicks: record.clicks, createdAt: record.createdAt });
  });

  app.post("/api/links", async (c) => {
    const body = await c.req.json().catch(() => null);
    const url = typeof body?.url === "string" ? body.url : null;
    if (!url) return c.json({ error: "field 'url' wajib string" }, 400);

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return c.json({ error: "url tidak valid" }, 400);
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return c.json({ error: "url harus http/https" }, 400);
    }

    const code = generateId();
    store.create(url, code);
    return c.json({ code }, 201);
  });

  // ⚠️ Paling AKHIR didaftarkan: rute "/:code" satu segmen akan menelan
  // apapun yang tidak kena rute di atasnya. Urutan = hidup matinya API-mu.
  app.get("/:code", (c) => {
    const record = store.find(c.req.param("code"));
    if (!record) return c.json({ error: "link tidak ditemukan" }, 404);
    store.recordHit(record.code);
    return c.redirect(record.url, 301);
  });

  return app;
}
