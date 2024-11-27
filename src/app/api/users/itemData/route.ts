import { NextRequest } from "next/server";
import { middleware } from "../../middleware";
import { dbConnect } from "@/app/database/database";
import Item from "@/app/_models/Item";
import sanitizeHtml from 'sanitize-html';

// Define the expected user data structure
interface UserData {
  _id: string;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  gender: string;
}

// Add item for authenticated user
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await middleware();
    if (!data) {
      return new NextResponse(JSON.stringify({ msg: "Unauthorized access" }))
    };
    await dbConnect();
    const itemData = await request.json();
    if (!itemData.name || !itemData.user || !itemData.completionDate) {
      return new NextResponse(JSON.stringify({ msg: "All fields are required" }))
    }
    const name = sanitizeHtml(itemData.name);
    const user = sanitizeHtml(itemData.user);
    const completionDate = sanitizeHtml(itemData.completionDate);
    const startDate = sanitizeHtml(itemData.startDate);
    const amount = sanitizeHtml(itemData.amount);

    const cleanItemData = {
      name,
      user,
      completionDate,
      startDate,
      amount
    }
    const newItem = await new Item(cleanItemData).save();
    return new NextResponse(
      JSON.stringify({ success: "Item added" }),
      { status: 201 }
    );
  }
  catch (err) {
    console.error("Error adding item data:", err.message);
    return new Response(
      JSON.stringify({
        msg: "Error adding item data",
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Get all authenticated user items
export async function GET(req: NextRequest) {
    try {
        type userData = {
            _id: string,
            username: string,
            user: string
        }

        const data = await middleware();
        if (!data) {
            return new Response(JSON.stringify({ msg: "Unauthorized access" }));
        }

        await dbConnect();

        // Assuming "createdAt" is the field you want to sort by.
        const itemData = await Item.find({ user: data._id }).sort({ createdAt: -1 }); // -1 sorts in descending order

        return new Response(JSON.stringify(itemData));
    } catch (err) {
        return new Response(JSON.stringify({ msg: err.message }));
    }
}
