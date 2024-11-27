export const dynamic = 'force-dynamic';
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { middleware } from "../../middleware";

const SECRET_KEY = process.env.SECRET_KEY;
// Define the POST route handler for accessToken
export async function POST(req, res) {
  try {
    const data = await middleware();

    if (data) {
      const userInfo = {
        username: data.username,
        _id: data._id,
        is_superuser: data.is_superuser,
      };

      const accessToken = jwt.sign(
        {
          username: data.username,
          _id: data._id,
          is_superuser: data.is_superuser,
        },
        SECRET_KEY,
        {
          expiresIn: "9m",
        }
      );

      // Set security headers
      const securityHeaders = {
        "Content-Security-Policy": "default-src 'self'",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      };
      // Send the new access token back to the client
      return new Response(JSON.stringify({ accessToken, userInfo }), {
        headers: {
          "Set-Cookie": `accessToken=${accessToken}; Path=/; Max-Age=${
            60 * 10
          };httpOnly; ${
            process.env.NODE_ENV === "production" ? "Secure;" : ""
          } `,
          "Content-Type": "application/json",
          ...securityHeaders,
        },
      });
    } else {
      console.log("no user");
      return new Response(JSON.stringify({ userInfo: null }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return new Response(JSON.stringify({ msg: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
