import { createServer } from "http";

import { createApp } from "./app";

const PORT = Number(process.env.PORT ?? 4000);

async function start() {
  const app = createApp();
  const server = createServer(app);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", error);
  process.exitCode = 1;
});
