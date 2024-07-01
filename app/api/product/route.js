import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request = null) {
  const uri = process.env.mongoURI;
  const client = new MongoClient(uri);
  try {
    const db = client.db("stocker");
    const inventory = db.collection("inventory");
    const products = await inventory.find({}).toArray();
    // console.log(products, "all products");
    return NextResponse.json({success: true, products});
} catch (error) {
    console.log(error, "while getting all products..");
    return new NextResponse({ok: false});
} finally {
    await client.close();
  }
}

export async function POST(request) {
    const uri = process.env.mongoURI;
    const client = new MongoClient(uri);
    const product = await request.json();
    console.log(product);
    try {
      const db = client.db("stocker");
      const inventory = db.collection("inventory");
      await inventory.insertOne(product);
      return NextResponse.json({"product added": product, ok: true});
    } catch (error) {
      console.log(error, "while adding a product..");
      return NextResponse.json({"product": product, ok: false});
    } finally {
      await client.close();
    }
}
