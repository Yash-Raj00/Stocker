const { NextResponse } = require("next/server");

export async function POST(request = null) {
  const response = new NextResponse(
    JSON.stringify({ success: true, message: "Logged out successfully" })
  );
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return response;
}
