"use client";

import { ChangeEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showErrorMsg, showSuccessMsg } from "@/app/_utils/Alert";
import { useAuth } from "@/app/_utils/AuthProvider";
import axios from "axios";
import swal from "sweetalert";

type Item = {
  _id: string;
  name: string;
  user: string;
  completionDate: string;
  startDate: string;
  amount: string;
};

const API_BASE = "/api/users/itemData";

const User = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [itemData, setItemData] = useState<Item[] | null>(null);
  const [newItem, setNewItem] = useState<Partial<Item>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch items when component mounts
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchItems();
    }
  }, [user, router]);

  const fetchItems = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setItemData(data);
    } catch (error) {
      showErrorMsg(error.message || "Error loading items");
    }
  };

  const handleAddItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newItem.name || !newItem.completionDate || !newItem.amount) {
      showErrorMsg("All fields are required.");
      return;
    }

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newItem, user: user?._id, startDate: new Date() }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccessMsg(data.success);
        fetchItems();
        setNewItem({});
      } else {
        showErrorMsg(data.msg || "Error adding item");
      }
    } catch (error) {
      showErrorMsg(error.message);
    }
  };

  const handleEditItem = async (id: string) => {
    try {
      const updatedItem = itemData?.find((item) => item._id === id);
      if (!updatedItem) return;

      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      const data = await res.json();
      if (data.success) {
        showSuccessMsg(data.success);
        fetchItems();
        setEditingId(null);
      } else {
        showErrorMsg(data.msg || "Error updating item");
      }
    } catch (error) {
      showErrorMsg("Failed to update item: " + error.message);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        showSuccessMsg(data.success);
        fetchItems();
      } else {
        showErrorMsg(data.msg || "Error deleting item");
      }
    } catch (error) {
      showErrorMsg("Failed to delete item: " + error.message);
    }
  };

  const handleLogout = async () => {
    const confirmed = await swal({
      title: "Confirm to log out",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmed) {
      try {
        const res = await axios.delete("/api/users/userData", { withCredentials: true });
        setUser(null);
        showSuccessMsg(res.data.success);
      } catch (error) {
        showErrorMsg(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Link className="link" href="/">
        Back
      </Link>
      <h2>Hello {user?.username}</h2>
      <button className="link" onClick={handleLogout}>
        Logout
      </button>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="border p-4 rounded shadow-md mt-4">
        <h3 className="mb-2 font-semibold">Add Item</h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Item Name"
            className="input"
            value={newItem.name || ""}
            onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="date"
            className="input"
            value={newItem.completionDate || ""}
            onChange={(e) => setNewItem((prev) => ({ ...prev, completionDate: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Amount"
            className="input"
            value={newItem.amount || ""}
            onChange={(e) => setNewItem((prev) => ({ ...prev, amount: e.target.value }))}
          />
        </div>
        <button type="submit" className="button mt-2">
          Add Item
        </button>
      </form>

      {/* Items Table */}
      <table className="mt-4 min-w-full bg-white shadow-md rounded table-fixed overflow-x-auto">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Date Created</th>
            <th className="py-2 px-4 border-b text-left">Completion Date</th>
            <th className="py-2 px-4 border-b text-left">Amount</th>
            <th className="py-2 px-4 border-b text-center">Edit</th>
            <th className="py-2 px-4 border-b text-center">Delete</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {itemData && itemData.length > 0 ? (
            itemData.map((item) => (
              <tr
                key={item._id}
                className={`${editingId === item._id ? "bg-yellow-100" : "bg-white"
                  } hover:bg-gray-100`}
              >
                <td className="py-2 px-4 border-b">
                  {editingId === item._id ? (
                    <input
                      value={item.name}
                      onChange={(e) =>
                        setItemData((prev) =>
                          prev?.map((i) =>
                            i._id === item._id ? { ...i, name: e.target.value } : i
                          )
                        )
                      }
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(item.startDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {editingId === item._id ? (
                    <input
                      type="date"
                      value={item.completionDate}
                      onChange={(e) =>
                        setItemData((prev) =>
                          prev?.map((i) =>
                            i._id === item._id
                              ? { ...i, completionDate: e.target.value }
                              : i
                          )
                        )
                      }
                    />
                  ) : (
                    new Date(item.completionDate).toLocaleDateString()
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editingId === item._id ? (
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        setItemData((prev) =>
                          prev?.map((i) =>
                            i._id === item._id ? { ...i, amount: e.target.value } : i
                          )
                        )
                      }
                    />
                  ) : (
                    item.amount
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editingId === item._id ? (
                    <button
                      onClick={() => {
                        handleEditItem(item._id);
                        setEditingId(null);
                      }}
                      className="link"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingId(item._id)}
                      className="link"
                    >
                      Edit
                    </button>
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editingId === item._id ? (<p className="bg-gray-200 text-gray-500 cursor-not-allowed">
                    Delete
                  </p>)
                    : <button onClick={() => handleDeleteItem(item._id)} className="link">
                    Delete
                    </button>}

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-2 px-4 border-b text-center">
                No items available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default User;


// "use client";
// import { ChangeEvent, useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { showErrorMsg, showSuccessMsg } from "@/app/_utils/Alert";
// import { useAuth } from "@/app/_utils/AuthProvider";
// import axios from "axios";
// import swal from "sweetalert";

// const User = () => {
//   type Item = {
//     _id: string;
//     name: string;
//     user: string;
//     completionDate: string;
//     startDate: string;
//     amount: string;
//   };

//   const { user, setUser } = useAuth();
//   const router = useRouter();
//   const [itemData, setItemData] = useState<Item[] | null>(null); // For viewing user items
//   const [item, setItem] = useState<Item | null>(null); // For adding new items
//   const [editingId, setEditingId] = useState<string | null>(null); // For tracking which item is being edited

//   const addItem = async (event: React.FormEvent) => {
//     event.preventDefault();
//     const itemData = {
//       name: item?.name,
//       user: user?._id,
//       completionDate: item?.completionDate,
//       startDate: new Date(),
//       amount: item?.amount,
//     };
//     try {
//       const res = await fetch("/api/users/itemData", {
//         method: "POST",
//         body: JSON.stringify(itemData),
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       getData();
//     } catch (error) {
//       showErrorMsg(error.message);
//     }
//   };
//   const editItem = async (id: string) => {
//     try {
//       const res = await fetch(`/api/users/itemData/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(item),
//       });
//       console.log(item)
//       const data = await res.json();
//       if (data.success) {
//         showSuccessMsg(data.success);
//         getData();
//       } else {
//         showErrorMsg(data.msg || "Error updating item");
//       }
//     } catch (error) {
//       showErrorMsg("Failed to update item: " + error.message);
//     }
//   };

//   const deleteItem = async (id: string) => {
//     try {
//       const res = await fetch(`/api/users/itemData/${id}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       if (data.success) {
//         showSuccessMsg(data.success);
//         getData();
//       } else {
//         showErrorMsg(data.msg || "Error deleting item");
//       }
//     } catch (error) {
//       showErrorMsg("Failed to delete item: " + error.message);
//     }
//   };

//   const getData = async () => {
//     try {
//       const res = await fetch("/api/users/itemData");
//       if (!res.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await res.json();
//       setItemData(data);
//     } catch (error) {
//       showErrorMsg(error.message);
//     }
//   };

//   const logOut = async () => {
//     try {
//       const confirmedLogOut = await swal({
//         title: "Confirm to log out",
//         icon: "warning",
//         buttons: true,
//         dangerMode: true,
//       });

//       if (confirmedLogOut) {
//         try {
//           const res = await axios.delete("/api/users/userData", {
//             withCredentials: true,
//           });
//           setUser(null);
//           setTimeout(() => {
//             showSuccessMsg(res.data.success);
//           }, 1000);
//         } catch (error) {
//           showErrorMsg(error.message);
//         }
//       }
//     } catch (error) {
//       showErrorMsg(error.message);
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       router.push("/login");
//     }
//   }, [router, user]);

//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <div className="flex flex-col h-screen">
//       <Link className="link" href="/">
//         Back
//       </Link>
//       <h2>Hello {user?.username}</h2>
//       <button className="link" onClick={logOut}>
//         Logout
//       </button>
//       <p>Add Item</p>
//       <form
//         onSubmit={addItem}
//         style={{
//           border: "2px solid blue",
//           padding: "10px",
//           borderRadius: "8px",
//         }}
//       >
//         <label className="mr-4">Name</label>
//         <input
//           type="text"
//           value={item?.name || ""}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setItem((prevItem) =>
//               prevItem
//                 ? { ...prevItem, name: e.target.value }
//                 : {
//                     name: e.target.value,
//                     user: user?._id || "",
//                     completionDate: "",
//                     startDate: "",
//                     amount: "",
//                   }
//             )
//           }
//         />
//         <hr className="mt-2 mb-2" />
//         <label className="mr-4">Completion Date</label>
//         <input
//           type="date"
//           value={item?.completionDate || ""}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setItem((prevItem) =>
//               prevItem
//                 ? { ...prevItem, completionDate: e.target.value }
//                 : {
//                     name: "",
//                     user: user?._id || "",
//                     completionDate: e.target.value,
//                     startDate: "",
//                     amount: "",
//                   }
//             )
//           }
//         />
//         <hr className="mt-2 mb-2" />
//         <label className="mr-4">Money required</label>
//         <input
//           type="number"
//           value={item?.amount || ""}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setItem((prevItem) => ({
//               ...prevItem,
//               amount: e.target.value,
//             }))
//           }
//         />
//         <hr className="mt-2 mb-2" />
//         <button className="button" type="submit">
//           Add Item
//         </button>
//       </form>

//       <table className="mt-4 min-w-full bg-white shadow-md rounded table-fixed overflow-x-auto">
//         <thead className="bg-gray-200 text-gray-700">
//           <tr>
//             <th className="py-2 px-4 border-b text-left">Name</th>
//             <th className="py-2 px-4 border-b text-left">Date Created</th>
//             <th className="py-2 px-4 border-b text-left">Completion Date</th>
//             <th className="py-2 px-4 border-b text-left">Amount</th>
//             <th className="py-2 px-4 border-b text-center">Edit</th>
//             <th className="py-2 px-4 border-b text-center">Delete</th>
//           </tr>
//         </thead>
//         <tbody className="text-gray-700">
//           {itemData ? (
//             itemData.map((item) => (
//               <tr key={item._id} className="bg-white hover:bg-gray-100">
//                 <td className="py-2 px-4 border-b">
//                   {editingId === item._id ? (
//                     <input
//                       value={item.name}
//                       onChange={(e) =>
//                         setItemData((prev) =>
//                           prev?.map((i) =>
//                             i._id === item._id
//                               ? { ...i, name: e.target.value }
//                               : i
//                           )
//                         )
//                       }
//                     />
//                   ) : (
//                     item.name
//                   )}
//                 </td>
//                 <td className="py-2 px-4 border-b">
//                   {new Date(item.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="py-2 px-4 border-b">
//                   {editingId === item._id ? (
//                     <input
//                       type="date"
//                       value={item.completionDate}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                         setItemData((prev) =>
//                           prev?.map((i) =>
//                             i._id === item._id
//                               ? { ...i, completionDate: e.target.value }
//                               : i
//                           )
//                         )
//                       }
//                     />
//                   ) : (
//                     new Date(item.completionDate).toLocaleDateString()
//                   )}
//                 </td>
//                 <td className="py-2 px-4 border-b">
//                   {editingId === item._id ? (
//                     <input
//                       type="number"
//                       value={item.amount}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                         setItemData((prev) =>
//                           prev?.map((i) =>
//                             i._id === item._id
//                               ? { ...i, amount: e.target.value }
//                               : i
//                           )
//                         )
//                       }
//                     />
//                   ) : (
//                     item.amount
//                   )}
//                 </td>
//                 <td className="py-2 px-4 border-b text-center">
//                   {editingId === item._id ? (
//                     <button
//                       onClick={() => {
//                         editItem(item._id);
//                         setEditingId(null); // Stop editing after saving
//                       }}
//                       className="link"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => setEditingId(item._id)}
//                       className="link"
//                     >
//                       Edit
//                     </button>
//                   )}
//                 </td>
//                 <td className="py-2 px-4 border-b text-center">
//                   <button
//                     onClick={() => deleteItem(item._id)}
//                     className="link"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={6} className="py-2 px-4 border-b text-center">
//                 No items available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default User;




// "use client";
// import { ChangeEvent, useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { showErrorMsg, showSuccessMsg } from "@/app/_utils/Alert";
// import { useAuth } from "@/app/_utils/AuthProvider";
// import axios from "axios";
// import swal from "sweetalert";

// const User = () => {
//   type Item = {
//     name: string;
//     user: string;
//     completionDate: string;
//     startDate: string;
//     amount: string;
//   };
//   const { user, setUser } = useAuth();
//   const router = useRouter();
//   const [itemData, setItemData] = useState<Item[] | null>(null); //For viewing user items
//   const [item, setItem] = useState<Item | null>(null); //For adding new items
//   const [edit, setEdit] = useState(false);


//   const addItem = async (event: React.FormEvent) => {
//     event.preventDefault();
//     const itemData = {
//       name: item?.name,
//       user: user?._id,
//       completionDate: item?.completionDate,
//       startDate: new Date(),
//       amount: item?.amount,
//     };
//     console.log(itemData);
//     try {
//       const res = await fetch("/api/users/itemData", {
//         method: "POST",
//         body: JSON.stringify(itemData),
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       getData();
//     } catch (error) {
//       showErrorMsg(error.message);
//     }
//   };

//   const editItem = async (id: string) => {
//     try {
      
//       const res = await fetch(`/api/users/itemData/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           body: JSON.stringify(itemData)
//         },
//       });
//       const data = await res.json();
//       if (data.success) {
//         showSuccessMsg(data.success);
//         getData();
//       } else {
//         showErrorMsg(data.msg || "Error deleting item");
//       }
//     } catch (error) {
//       // Catch network or unexpected errors
//       showErrorMsg("Failed to delete item: " + error.message);
//     }
//   };

//   const deleteItem = async (id: string) => {
//     try {
//       const res = await fetch(`/api/users/itemData/${id}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       if (data.success) {
//         showSuccessMsg(data.success);
//         getData();
//       } else {
//         showErrorMsg(data.msg || "Error deleting item");
//       }
//     } catch (error) {
//       // Catch network or unexpected errors
//       showErrorMsg("Failed to delete item: " + error.message);
//     }
//   };

//   const getData = async () => {
//     try {
//       const res = await fetch("/api/users/itemData");
//       if (!res.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await res.json();
//       setItemData(data);
//     } catch (error) {
//       showErrorMsg(error.message);
//     }
//   };

//   const logOut = async () => {
//     try {
//       const confirmedLogOut = await swal({
//         title: "Confirm to log out",
//         icon: "warning",
//         buttons: true,
//         dangerMode: true,
//       });

//       if (confirmedLogOut) {
//         try {
//           const res = await axios.delete("/api/users/userData", {
//             withCredentials: true,
//           });
//           setUser(null);
//           setTimeout(() => {
//             showSuccessMsg(res.data.success);
//           }, 1000);
//         } catch (error) {
//           showErrorMsg(error.message);
//         }
//       }
//     } catch (error) {
//       showErrorMsg(error.message);
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       router.push("/login");
//     }
//   }, [router, user]);
//   useEffect(() => {
//     getData();
//   }, []);
//   return (
//     <div className="flex flex-col h-screen">
//       <Link className="link" href="/">
//         Back
//       </Link>
//       <h2>Hello {user?.username}</h2>
//       <button className="link" onClick={logOut}>
//         Logout
//       </button>
//       <p>Add Item</p>
//       <form
//         onSubmit={addItem}
//         style={{
//           border: "2px solid blue",
//           padding: "10px",
//           borderRadius: "8px",
//         }}
//       >
//         <label className="mr-4">Name</label>
//         <input
//           type="text"
//           value={item?.name || ""}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setItem((prevItem) =>
//               prevItem
//                 ? { ...prevItem, name: e.target.value }
//                 : {
//                   name: e.target.value,
//                   user: user?._id || "",
//                   completionDate: "",
//                   startDate: "",
//                   amount: "",
//                 }
//             )
//           }
//         />
//         <hr className="mt-2 mb-2" />
//         <label className="mr-4">Completion Date</label>
//         <input
//           type="date"
//           value={item?.completionDate || ""}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setItem((prevItem) =>
//               prevItem
//                 ? { ...prevItem, completionDate: e.target.value }
//                 : {
//                   name: "",
//                   user: user?._id || "",
//                   completionDate: e.target.value,
//                   startDate: "",
//                   amount: "",
//                 }
//             )
//           }
//         />
//         <hr className="mt-2 mb-2" />
//         <label className="mr-4">Money required</label>
//         <input
//           type="number"
//           value={item?.amount || ""}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setItem((prevItem) =>
//               prevItem
//                 ? { ...prevItem, amount: e.target.value }
//                 : {
//                   name: "",
//                   user: user?._id || "",
//                   completionDate: "",
//                   startDate: "",
//                   amount: e.target.value,
//                 }
//             )
//           }
//         />
//         <hr className="mt-2 mb-2" />
//         <button className="button" type="submit">
//           Add Item
//         </button>
//       </form>

//       <table className="mt-4 min-w-full bg-white shadow-md rounded table-fixed overflow-x-auto">
//         <thead className="bg-gray-200 text-gray-700">
//           <tr>
//             <th className="py-2 px-4 border-b text-left">Name</th>
//             <th className="py-2 px-4 border-b text-left">Date Created</th>
//             <th className="py-2 px-4 border-b text-left">Completion Date</th>
//             <th className="py-2 px-4 border-b text-left">Amount</th>
//             <th className="py-2 px-4 border-b text-center">Edit</th>
//             <th className="py-2 px-4 border-b text-center">Delete</th>
//           </tr>
//         </thead>
//         <tbody className="text-gray-700">
//           {itemData ? (
//             itemData.map((item) => (
//               <tr key={item._id} className="bg-white hover:bg-gray-100">
//                 <td className="py-2 px-4 border-b">{item.name}</td>
//                 <td className="py-2 px-4 border-b">
//                   {new Date(item.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="py-2 px-4 border-b">
//                   {new Date(item.completionDate).toLocaleDateString()}
//                 </td>
//                 {/* <td className="py-2 px-4 border-b">{item.amount}</td> */}
//                 {edit && itemData.filter((it)=>it._id == item._id) ? <input value={item.amount}/>
//                 : <td className="py-2 px-4 border-b">{item.amount}</td>}
//                 <td className="py-2 px-4 border-b text-center">
//                   <button onClick={()=>setEdit(true)} className="link">
//                     Edit
//                   </button>
//                 </td>
//                 <td className="py-2 px-4 border-b text-center">
//                   <button onClick={() => deleteItem(item._id)} className="link">
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={6} className="py-2 px-4 border-b text-center">
//                 No items available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default User;

