import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { linksRoutes } from "./routes/links.js";
import { createMemoryStore } from "./store/memory.js";

const app = new Hono();

// /healthz WAJIB didaftarkan sebelum mount linksRoutes —
// kalau tidak, "healthz" akan tertangkap rute "/:code" (dan dihitung sebagai hit!).
app.get("/healthz", (c) => c.json({ status: "ok" }));

const store = createMemoryStore();
app.route("/", linksRoutes(store));

// Config dari env — mulai kebiasaan 12-factor dari hari pertama (audit W3).
const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`shortlink-api listening on http://localhost:${info.port}`);
});
