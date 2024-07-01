import connectToDatabase from "@/utils/connectToDatabase";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request = null) {
  try {
    const { username, email, password } = await request.json();
    console.log("body: ", username, email, password);
    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all fields",
        },
        {
          status: 400,
        }
      );
    }
    const { db } = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection error",
        },
        {
          status: 500,
        }
      );
    }
    const userExists = await db.collection("users").findOne({ email });
    if (userExists) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }
    const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const user = await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { username, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    user.username = username;
    user.email = email;
    user.token = token;
    user.password = undefined;
    console.log("Uuuuuuser", user);
    const response = NextResponse.json(
      { success: true, message: "User created", user },
      { status: 201 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge:  3600 * 3600 * 1000,
      // path: "/",
    });
    return response;
  } catch (error) {
    console.error("Last Error", error);
    NextResponse.json(
      { success: false, message: "catched error", user },
      { status: 500 }
    );
  }
}
