"use client";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from '/@/app/_utils/AuthProvider';
import { useAuth } from "@/app/_utils/AuthProvider";
import { showErrorMsg } from "./_utils/Alert";

export default function Main() {
  const router = useRouter();

  const { user, setUser } = useAuth();
  // const SECRET_KEY = process.env.SECRET_KEY;

  const getRefreshToken = useCallback(async () => {
    try {
      const res = await axios.post("/api/users/getRefreshtoken",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const { userInfo } = res.data;
        console.log(userInfo);
        setUser(userInfo);
      } else {
        // error experienced
        showErrorMsg(res.data.msg);
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      showErrorMsg(error.message);
    }
  }, [router, setUser]);

  useEffect(() => {
    getRefreshToken();
  }, [getRefreshToken]);

  return null;
}
