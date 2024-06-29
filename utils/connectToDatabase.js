import { MongoClient } from "mongodb";

const uri = process.env.mongoURI;
const dbName = "stocker";
let client;
let db;
export default async function connectToDatabase() {
  client = new MongoClient(uri);
  db = client.db(dbName);

  return { client, db };
}
