import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
// Utility function to extract cookies from the request
const extractCookies = () => {
  const allCookies = cookies().toString().split(";");
  const extractedCookies: Record<string, string> = {};

  // Iterate over each cookie string and extract name and value
  allCookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    extractedCookies[name] = value;
  });

  return Object.keys(extractedCookies).length ? extractedCookies : null;
};

// Define the middleware function to extract user data from the token
export async function middleware(req: Request): Promise<any | null> {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    const cookies = extractCookies();

    // If there's no cookies or no refresh token, return null
    const { refreshToken } = cookies ?? {};
    if (!refreshToken) {
      console.log("No refresh token found");
      return null;
    }

    // Verify the refresh token and extract the user data
    const decodedData = jwt.verify(refreshToken, SECRET_KEY);

    // If decoding fails, return null (token might be invalid or expired)
    if (!decodedData) {
      console.log("Invalid token");
      return null;
    }

    // Return the decoded user data (this can be adjusted based on what data you need)
    return decodedData;
  } catch (error) {
    console.error("Error in middleware:", error);
    return null; // Return null in case of any error
  }
}

// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// /**
//  * The middleware checks for available cookies,
//  * validates and returns a user object with username, _id, is_superuser.
//  * If no tokens or invalid tokens, returns null
//  */
// const extractCookies = () => {
//   const allCookies = cookies().toString().split(";");
//   const extractedCookies = {};
//   // Iterate over each cookie string
//   allCookies.forEach((cookie) => {
//     // Split the cookie string by "=" to separate name and value
//     const [name, value] = cookie.trim().split("=");

//     // Add the cookie to the extractedCookies object
//     extractedCookies[name] = value;
//   });
//   // return extractedCookies;
//   return Object.keys(extractedCookies).length ? extractedCookies : null;
// };

// // Define the POST route handler for refreshToken
// export async function middleware(req, res) {
//   try {
//     const SECRET_KEY = process.env.SECRET_KEY;
//     const { refreshToken } = extractCookies();

//     if (refreshToken) {
//       // Verify the refresh token and extract the username
//       const decodedData = jwt.verify(refreshToken, SECRET_KEY);
//       if (!decodedData) {
//         return new Response(JSON.stringify({ msg: "Invalid token" }), {
//           status: 401,
//           headers: { "Content-Type": "application/json" },
//         });
//       }
//       return decodedData;
//     } else {
//       console.log("no user");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return new Response(JSON.stringify({ msg: error.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
