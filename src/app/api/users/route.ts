/**
 * Generates a logging in user data and others.
 */

export const dynamic = 'force-dynamic';
import { dbConnect } from "@/app/database/database";
import User from "@/app/_models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// User login
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const SECRET_KEY = process.env.SECRET_KEY;

    // Handle your route logic using the accessToken and refreshToken variables
    const { username, password } = await request.json();

    if (!username || !password) {
      throw new Error("Username and Password are required!");
    }

    // Check if the user exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid username");
    }
    // Verify the password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw new Error("Incorrect credentials");
    }
    user.last_login = new Date();
    await user.save()
    
    const newAccessToken = jwt.sign(
      {
        username: user.username,
        _id: user._id,
        is_superuser: user.is_superuser,
      },
      SECRET_KEY,
      {
        expiresIn: "9m",
      }
    );
    const newRefreshToken = jwt.sign(
      {
        username: user.username,
        _id: user._id,
        is_superuser: user.is_superuser,
      },
      SECRET_KEY,
      {
        expiresIn: "7d", 
      }
    );

    // Set security headers
    const securityHeaders = {
      "Content-Security-Policy": "default-src 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    };
    // Set the new tokens in the response headers
    const headers = {
      "Content-Type": "application/json",
      ...securityHeaders,
      "Set-Cookie": [
        `accessToken=${newAccessToken};path=/;Max-Age=${60 * 10};httpOnly;${
          process.env.NODE_ENV === "production" ? "Secure;" : ""
        }`, // Adjust Max-Age as needed
        `refreshToken=${newRefreshToken};${
          process.env.NODE_ENV === "production" ? "Secure;" : ""
        };path=/;httpOnly;Max-Age=${60 * 60 * 24 * 7}`,
      ],
    };
    return new Response(
      JSON.stringify({_id:user._id, username:user.username, is_superuser:user.is_superuser,  accessToken: newAccessToken, refreshToken: newRefreshToken,}),{ headers }
    );
  } catch (err) {
    console.error(err.message);
    return new Response(JSON.stringify({ msg: err.message }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

  
// Getting all users details
export async function GET(request) {
  try {
    // const data = await middleware();
    // if (!data) {
    //   throw new Error("Unauthorized Access");
    // }

    await dbConnect();
    const users = await User.find(); 

    const userData = [];
    users.forEach((user) => {
      const data = {
        _id:user._id,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
        is_superuser: user.is_superuser,
      };
      userData.push(data);
    });console.log(userData)
    return new Response(JSON.stringify(userData));
  } catch (err) {
    console.log(err.message);
    return new Response(JSON.stringify({ msg: err.message }));
  }
}