import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/connectToDatabase";
import jwt from "jsonwebtoken";

export async function GET(request = null) {
    const token = await request.cookies.get("token");
    console.log("coooooookiiiiee", token);
    if (!token) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        // const user = jwt.verify(token, process.env.JWT_SECRET); // Ye github copilot aur chatgpt chutiyo ka har baar ni sunna.
        const user = jwt.verify(token.value, process.env.JWT_SECRET);
        console.log("jwt user:==", user);
        const {db} = await connectToDatabase();
        const userExists = await db.collection("users").findOne({email: user.email});
        if(!userExists) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
            });
        }
        console.log("jwt user:==", user);
        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("jwtjwwjtwjtwj", error);
        return NextResponse.json({
            success: false,
            message: "Unauthorized",
        });
    }
}