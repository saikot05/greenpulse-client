import { MongoClient } from 'mongodb';

const uri1 = "mongodb+srv://greenpulse_db:oz8Safr26AyMjUUg@cluster0.yhupfzi.mongodb.net/greenpulse?retryWrites=true&w=majority";
const uri2 = "mongodb+srv://%3Cgreenpulse_db%3E:%3Coz8Safr26AyMjUUg%3E@cluster0.yhupfzi.mongodb.net/greenpulse?retryWrites=true&w=majority";

async function test(uri, label) {
  try {
    console.log(`Testing ${label}...`);
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    console.log(`${label} connected successfully!`);
    await client.close();
    return true;
  } catch (err) {
    console.log(`${label} failed:`, err.message);
    return false;
  }
}

async function run() {
  const success1 = await test(uri1, "URI without brackets");
  if (!success1) {
    await test(uri2, "URI with brackets");
  }
}

run();
