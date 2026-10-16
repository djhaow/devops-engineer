import { serve } from "@hono/node-server";
import { createApp } from "./app.js";

const app = createApp();

// Config dari env — mulai kebiasaan 12-factor dari hari pertama (audit W3).
const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`shortlink-api listening on http://localhost:${info.port}`);
});
