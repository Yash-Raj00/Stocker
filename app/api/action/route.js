import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { slug, action, currQty } = await request.json();
    const uri = process.env.mongoURI;
    const client = new MongoClient(uri);
    console.log(slug, action, currQty);
    const db = client.db("stocker");
    const inventory = db.collection("inventory");
    const filter = { "product-name": slug };
    const update = { $set: { quantity: Number(currQty) + Number(action) } };
    const result = await inventory.updateOne(filter, update, {});
    return NextResponse.json({
      success: true,
      message:
        result.matchedCount +
        " document(s) matched the filter,  updated " +
        result.modifiedCount,
    });
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}
