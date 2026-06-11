const { Client } = require('pg');
require('dotenv').config({ path: '../../.env' });
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  const models = await client.query('SELECT id FROM "BikeModel" LIMIT 2');
  console.log('Models:', models.rows);
  const vendors = await client.query('SELECT id FROM "Vendor" LIMIT 2');
  console.log('Vendors:', vendors.rows);
  await client.end();
}
run();
