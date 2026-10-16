import { Hono } from "hono";
import type { LinkStore } from "./store/memory.js";
import { createMemoryStore } from "./store/memory.js";
import { linksRoutes } from "./routes/links.js";

// App dipisahkan dari server supaya bisa diuji TANPA port/jaringan:
// test cukup memanggil app.request(...) — in-memory, cepat, deterministik.
// Store tetap disuntikkan: test memakai store segar di setiap berkasnya.
export function createApp(store: LinkStore = createMemoryStore()) {
  const app = new Hono();

  // /healthz WAJIB didaftarkan sebelum mount linksRoutes —
  // kalau tidak, "healthz" akan tertangkap rute "/:code" (dan dihitung sebagai hit!).
  app.get("/healthz", (c) => c.json({ status: "ok" }));

  app.route("/", linksRoutes(store));
  return app;
}
