import User from "@/app/_models/User";
import { dbConnect } from "@/app/database/database";
import sanitizeHtml from "sanitize-html";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formdata = await req.json(); // Accepting JSON data instead of formData

    // Connect to the database
    await dbConnect();

    // Sanitize form data (to avoid XSS or other attacks)
    const username = sanitizeHtml(formdata.username );
    const email = sanitizeHtml(formdata.email);
    const gender = sanitizeHtml(formdata.gender);
    const password1 = formdata.password;


    // Check if the password is provided
    if (!password1) {
      return new NextResponse(
        JSON.stringify({ msg: "Password is required" }),
        { status: 400 }
      );
    }
      // Check if the username is provided
    if (!username) {
      return new NextResponse(
        JSON.stringify({ msg: "Username is required" }),
        { status: 400 }
      );
    }
      // Check if the email is provided
    if (!email) {
      return new NextResponse(
        JSON.stringify({ msg: "User email is required" }),
        { status: 400 }
      );
    }

    // Hash password
    const password = await bcryptjs.hash(password1, 13);

    const is_superuser = false;
    const is_active = true;

    // User data for saving to the database
    const userData = {
      is_active,
      is_superuser,
      password,
      username,
      email,
      gender,
    };

    // Save new user to the database
    const newUser = await new User(userData).save();

    console.log("New User: ", newUser);
    return new NextResponse(
      JSON.stringify({ success: "User successfully added" }),
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating user:", err);
    return new NextResponse(
      JSON.stringify({ msg: err.message }),
      { status: 500 }
    );
  }
}

// import User from "@/app/_models/User";
// import { dbConnect } from "@/app/database/database";
// import sanitizeHtml from "sanitize-html";
// import bcryptjs from "bcryptjs";

// // Define the type of the request and response
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   try {
//     // Extract form data
//     const formdata = await req.formData();
    
//     // Connect to the database
//     await dbConnect();

//     // Get form data values (sanitize if needed)
//     const username = sanitizeHtml(formdata.get("username")?.toString() || "");
//     const email = sanitizeHtml(formdata.get("email")?.toString() || "");
//     const gender = sanitizeHtml(formdata.get("gender")?.toString() || "");
//     const password1 = formdata.get("password")?.toString() || "";

//     // Make sure password is not empty
//     if (!password1) {
//       return new NextResponse(
//         JSON.stringify({ msg: "Password is required" }),
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const password = await bcryptjs.hash(password1, 13); 

//     // Create user data
//     const is_superuser = false;
//     const is_active = true;

//     const userData = {
//       is_active,
//       is_superuser,
//       password,
//       username,
//       email,
//       gender,
//     };

//     // Create the new user and save to the database
//     const newUser = await new User(userData).save();

//     // Return success response
//     console.log("UserData ", userData);
//     console.log("New User ", newUser);

//     return new NextResponse(
//       JSON.stringify({ success: "User successfully added" }),
//       { status: 201 } // 201 for successful creation
//     );
//   } catch (err: any) {
//     console.error("Error creating user:", err);
//     return new NextResponse(
//       JSON.stringify({ msg: err.message }),
//       { status: 500 }
//     );
//   }
// }


// import User from "@/app/_models/User";
// import { dbConnect } from "@/app/database/database";
// import sanitizeHtml from "sanitize-html";
// import bcryptjs from "bcryptjs";
// import { NextRequest, NextResponse } from "next/server";

// // Create ew users
// export async function POST(req) {
//   try {
//     const formdata = await req.formData();
//     await dbConnect();
//     const is_superuser = false;
//     const is_active = true;
//     const username = formdata.get("username");
//     const email = formdata.get("email");
//     const gender = formdata.get("gender");
//     const password = await bcryptjs.hash(password1, 13);
//     const password1 = formdata.get("password"); //Not sent to the database

//     const userData = {
//       is_active,
//       is_superuser,
//       password,
//       username,
//       email,
//       gender,
//     };
//     // const { firstName, lastName, username, phone, email } = await request.json();
//     const newUser = await new User(userData).save();
//     console.log("UserData ", userData);
//     console.log("New User ", newUser);
//     return new Response(
//       JSON.stringify({ success: "User successfully added" })
//     );
//   } catch (err) {
//     return new Response(JSON.stringify({ msg: err.message }), { status: 500 });
//   }
// }
