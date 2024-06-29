import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = process.env.mongoURI;
  const client = new MongoClient(uri);
  try {
    const db = client.db("stocker");
    const inventory = db.collection("inventory");
    //   const query = request.query;
    const query = request.nextUrl.searchParams.get("query");
    const styleQuery = request.nextUrl.searchParams.get("styleQuery");
    console.log(query, styleQuery, "query");
    if (styleQuery) {
      let products = await inventory
        .aggregate([
          {
            $match: {
              $or: [
                { "product-name": { $regex: query, $options: "i" } },
              ],
            },
          },
        ])
        .toArray();
      products = products.filter((item) => item.style === styleQuery);
      return NextResponse.json({ success: true, products });
    } else {
      let products = await inventory
        .find({
          $or: [
            { "product-name": { $regex: query, $options: "i" } },
            { style: { $regex: query, $options: "i" } },
            // { category: { $regex: query, $options: "i" } },
          ],
        })
        .toArray();
      return NextResponse.json({ success: true, products });
    }
  } catch (error) {
    console.log(error, "while searching products..");
    return new NextResponse({ ok: false });
  } finally {
    await client.close();
  }
}
