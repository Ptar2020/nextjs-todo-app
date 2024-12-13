"use client";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showErrorMsg, showSuccessMsg } from "@/app/_utils/Alert";
import { useAuth } from "@/app/_utils/AuthProvider";

const Login = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  // State for username and password
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (!username || !password) {
        showErrorMsg("Both username and password are required");
        return;
      }

      const res = await fetch("/api/users", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.msg) {
        showErrorMsg("Server error: " + data.msg);
      } else {
        // Assuming the response contains the user data
        const user = data; // No need to redefine User type here
        setUser(user); // Update the user in the global state
        showSuccessMsg("Login successful");
        router.push(`/user/${user._id}`); 
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showErrorMsg(err.message);
      } else if (typeof err === "string") {
        showErrorMsg("Error: " + err);
      } else {
        showErrorMsg("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    if(user){
      router.push(`/user/${user._id}`);
    }
  }, [router, user]); 

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <p className="text-center text-2xl font-semibold mb-6">PLEASE LOGIN</p>
        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Username"
          />
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="w-full p-2 mt-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
          />
          <button
            disabled={!username || !password}
            className={`w-full py-2 text-white font-semibold rounded-md ${
              !username || !password
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            type="submit"
          >
            Submit
          </button>
          <div className="flex flex-col items-center">
            <Link
              className="link mt-2 mb-2"
              title="Reset your forgotten password"
              href="/reset-password"
            >
              Forgot password
            </Link>
            <Link
              className="link"
              title="Create an account with us"
              href="/signup"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

// "use client";
// import React, { ChangeEvent, FormEvent } from "react";
// import Link from "next/link";
// import {useState, useEffect} from 'react';
// import {useRouter} from 'next/navigation';
// import { showErrorMsg, showSuccessMsg } from "@/app/_utils/Alert";
// import { useAuth } from "@/app/_utils/AuthProvider";

// const Login = () => {
//   type User = {
//     _id: string,
//     username: string,
//     emai:string,
//     is_superuser: boolean,
//     is_active: boolean,
//     gender:string
//   }
//   const router = useRouter();
//   const { user, setUser } = useAuth();
//   // const [user, setUser] = useState<User | null>(null);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const submit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     try {
//       if (!username || !password) {
//         showErrorMsg("Both username and password required");
//         return;
//       }
//       // const res = await fetch("/api/users");
//        const res = await fetch("/api/users", {
//         method: "POST",  // POST for user creation
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({username,password}),
//       });
//       const data = await res.json();
//       console.log(data)
//       if (data.msg) {
//         showErrorMsg("Server error " + data.msg);
//       } else {
//         const user: User = data;
//         setUser(user);
//         router.push(`/user/${user._id}`)
//       }
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         showErrorMsg(err);
//       } else if (typeof err === "string") {
//         showErrorMsg("Err2 " + err);
//       } else {
//         showErrorMsg("An unexpected error occurred.");
//       }
//     }
//   };

//   useEffect(()=>{
//     // if(user){
//     //   router.push(`/user/${user._id}`)
//     // }
//   },[])
//   return (
//   <div className="flex items-center justify-center min-h-screen">
//     <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
//       <p className="text-center text-2xl font-semibold mb-6">PLEASE LOGIN</p>
//       <form onSubmit={submit}>
//         <label className="block text-sm font-medium text-gray-700">Username</label>
//         <input onChange={(e:ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
//           className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           type="text"
//           placeholder="Username"
//         />
//         <label className="block text-sm font-medium text-gray-700">Password</label>
//         <input onChange={(e:ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//           className="w-full p-2 mt-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           type="password"
//           placeholder="Password"
//         />
//        <button
//           disabled={!username || !password}
//           className={`w-full py-2 text-white font-semibold rounded-md ${
//             !username || !password ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
//           }`}
//           type="submit"
//         >
//           Submit
//         </button>
//          <div className='flex flex-col items-center' >
//           <Link className='link mt-2 mb-2' title='Reset your forgotten password' href='/reset-password'>Forgot password</Link>
//           <Link className='link' title="Create an account with us" href="/signup" >Signup</Link>
//           </div>
//       </form>
//     </div>
//   </div>
// );
// }
// export default Login;
