import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../database/database";
import { middleware } from "../../middleware";
import sanitizeHtml from 'sanitize-html';
import Item from "@/app/_models/Item";

// Define the expected user data structure
interface UserData {
  _id: string;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  gender: string;
}

// Get authenticated user data
export async function GET(request: Request) {
  try {
    // Get the authenticated user data from the middleware
    const userData = await middleware(request);

    if (!userData) {
      return new Response(JSON.stringify({ msg: "Unauthorized access" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to the database
    await dbConnect();

    // Assuming userData contains the necessary properties
    const userResponse: UserData = {
      _id: userData._id,
      username: userData.username,
      email: userData.email,
      is_active: userData.is_active,
      is_superuser: userData.is_superuser,
      gender: userData.gender,
    };

    // Return the user data as a JSON response
    return new Response(JSON.stringify({ data: userResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    return new Response(
      JSON.stringify({
        msg: "An error occurred while fetching user data",
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


// Logout an authenticated user
export async function DELETE(req: NextRequest, res) {
  try {
    const data = await middleware();
    if (!data) {
      throw new Error("Unauthorized Access");
    }

    // Set security headers
    const securityHeaders = {
      "Content-Security-Policy": "default-src 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    };
    // Send the new access token back to the client
    return new Response(
      JSON.stringify({ success: "Logged Out Successfully" }),
      {
        headers: {
          "Set-Cookie": [
            `accessToken=; Path=/; Max-Age=${60 * 0};httpOnly;${process.env.NODE_ENV === "production" ? "Secure;" : ""
            }`,
            `refreshToken=; Path=/; Max-Age=${60 * 0};httpOnly;${process.env.NODE_ENV === "production" ? "Secure;" : ""
            } `,
          ],

          "Content-Type": "application/json",
          ...securityHeaders,
        },
      }
    );
  } catch (err) {
    console.log(err.message);
    return new Response(JSON.stringify({ msg: err.message }));
  }
}
