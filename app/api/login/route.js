import connectToDatabase from "@/utils/connectToDatabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request = null) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Please provide all fields" },
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

  const user = await db.collection("users").findOne({ email });

  if (user) {
    console.log("found user", user);
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user._id, username: user.username, email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      user.token = token;
      user.password = undefined;
      const response = NextResponse.json(
        { success: true, message: "Login successful", user },
        { status: 200 }
      );
      response.cookies.set("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
      });
      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        {
          status: 401,
        }
      );
    }
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid email or password.",
      },
      {
        status: 401,
      }
    );
  }
}
