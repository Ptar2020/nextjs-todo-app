"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the User type
type User = {
  _id: string;
  username: string;
  email: string;
  is_superuser: boolean;
  is_active: boolean;
  gender: string;
} | null;

// Create a context for user authentication
const UserContext = createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
} | null>(null);

// UserProvider component to wrap the application
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};

// "use client";

// import {
//   createContext,
//   useState,
//   useContext,
//   ReactNode,
//   useEffect,
// } from "react";

// // Define the type for the user data
// type User = {
//   _id: string;
//   username: string;
//   email: string;
//   is_superuser: boolean;
//   is_active: boolean;
//   gender: string;
// };

// // Define the context type
// interface UserContextType {
//   user: User | null;
//   setUser: (user: User | null) => void;
// }

// // Create the context with an initial undefined value (we will ensure it's used properly)
// const UserContext = createContext<UserContextType | undefined>(undefined);

// // UserProvider component to provide the user state and setter function
// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   // Simulating fetching user data after successful login or app initialization
//   useEffect(() => {
//     // Simulate fetching the user after login or initial app load
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("/api/users"); // Replace with your actual API endpoint
//         if (!response.ok) {
//           throw new Error("Failed to fetch user");
//         }
//         const userData: User = await response.json();
//         setUser(userData); // Set user data after successful response
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUser(null); // In case of error, set user as null
//       }
//     };

//     fetchUser();
//   }, []); // Empty dependency array means it runs once when the component mounts

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Custom hook to access the user context
// export const useAuth = (): UserContextType => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useAuth must be used within a UserProvider");
//   }
//   return context;
// };





// "use client";

// import { createContext, useState, useContext } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   return (
//     <UserContext.Provider
//       value={{ user, setUser}}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useAuth = () => useContext(UserContext);

// import { createContext, useState, useContext, useEffect } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check for authentication tokens in cookies on component mount
//     const accessToken = getCookie("accessToken");
//     const refreshToken = getCookie("refreshToken");

//     // If tokens are present, update the authentication state
//     if (accessToken && refreshToken) {
//       setUser({ accessToken, refreshToken });
//     }
//   }, []);

//   const setAuthTokens = ({ accessToken, refreshToken }) => {
//     // Store tokens in cookies
//     setCookie("accessToken", accessToken);
//     setCookie("refreshToken", refreshToken);

//     // Update authentication state
//     setUser({ accessToken, refreshToken });
//   };

//   const clearAuthTokens = () => {
//     deleteCookie("accessToken");
//     deleteCookie("refreshToken");

//     // Clear authentication state
//     setUser(null);
//   };

//   return (
//     <UserContext.Provider
//       value={{ user, setUser, setAuthTokens, clearAuthTokens }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useAuth = () => useContext(UserContext);

// // Helper functions for working with cookies
// const setCookie = (name, value) => {
//   document.cookie = `${name}=${value}; path=/;`;
// };

// const getCookie = (name) => {
//   const cookies = document.cookie
//     .split(";")
//     .map((cookie) => cookie.trim().split("="));
//   const cookie = cookies.find(([cookieName]) => cookieName === name);
//   return cookie ? cookie[1] : null;
// };

// const deleteCookie = (name) => {
//   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
// };
