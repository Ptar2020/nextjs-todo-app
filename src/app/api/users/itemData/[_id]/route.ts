import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/database/database";
import Item  from "@/app/_models/Item";
import { middleware } from "@/app/api/middleware";


export async function PATCH(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    // Middleware check
    const data = await middleware(req);
    if (!data) {
      return new NextResponse(JSON.stringify({ msg: "Unauthorized access" }), {
        status: 401,
      });
    }

    // Parse request body for updates
    const updates = await req.json();
    if (!updates || Object.keys(updates).length === 0) {
      return new NextResponse(
        JSON.stringify({ msg: "No data provided for update" }),
        { status: 400 }
      );
    }

    // DB connection
    await dbConnect();

    // Find the item to edit by ID
    const itemToEdit = await Item.findById(params._id);
    if (!itemToEdit) {
      return new NextResponse(JSON.stringify({ msg: "Item does not exist" }), {
        status: 404,
      });
    }

    // Apply updates and save
    Object.assign(itemToEdit, updates);
    await itemToEdit.save();

    // Return success message
    return new NextResponse(
      JSON.stringify({ success: "Item updated successfully", item: itemToEdit }),
      { status: 200 }
    );
  } catch (err) {
    // Return error message
    return new NextResponse(JSON.stringify({ msg: err.message }), {
      status: 500,
    });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    // Middleware check
    const data = await middleware(req);
    if (!data) {
      return new NextResponse(JSON.stringify({ msg: "Unauthorized access" }), {
        status: 401,
      });
    }

    // DB connection
    await dbConnect();

    // Find the item to delete by ID
    const itemToDelete = await Item.findById(params._id);
    if (!itemToDelete) {
      return new NextResponse(JSON.stringify({ msg: "Item does not exist" }), {
        status: 404,
      });
    }

    // Delete the item
    await itemToDelete.deleteOne();

    // Return success message
    return new NextResponse(
      JSON.stringify({ success: "Item deleted" }),
      { status: 200 }
    );
  } catch (err) {
    // Return error message
    return new NextResponse(JSON.stringify({ msg: err.message }), {
      status: 500,
    });
  }
}



// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { _id: string } }
// ) {
//   try {
//     // Middleware check
//     const data = await middleware(req);
//     if (!data) {
//       return new NextResponse(JSON.stringify({ msg: "Unauthorized access" }), {
//         status: 401,
//       });
//     }

//     // DB connection
//     await dbConnect();

//     // Find the item to delete by ID
//     const itemToDelete = await Item.findOne({ _id: params._id });console.log(itemToDelete)
//     if (!itemToDelete) {
//       return new NextResponse(JSON.stringify({ msg: "Item does not exist" }), {
//         status: 404,
//       });
//     }

//     // Delete the item
//     await itemToDelete.deleteOne();

//     // Return success message
//     return new NextResponse(
//       JSON.stringify({ success: "Item deleted" }),
//       { status: 200 }
//     );
//   } catch (err) {
//     // Return error message
//     return new NextResponse(JSON.stringify({ msg: err.message }), {
//       status: 500,
//     });
//   }
// }
