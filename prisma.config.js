const fs = require('node:fs');
const path = require('node:path');
const envPath = [path.join(__dirname, '.env'), path.resolve(__dirname, '../.env')]
  .find((candidate) => fs.existsSync(candidate));

if (envPath) require('dotenv').config({ path: envPath });

const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: process.env.DATABASE_URL }
});
