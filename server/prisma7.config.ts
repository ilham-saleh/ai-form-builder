// import "dotenv/config";
// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",

//   migrations: {
//     path: "prisma/migrations",
//   },

//   datasource: {
//     url: env("DIRECT_URL"),
//   },
// });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: "file:./prisma/dev.db",
  },
});
