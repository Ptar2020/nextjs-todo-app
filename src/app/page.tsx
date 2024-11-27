"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./_utils/AuthProvider";

const PageLayout = () => {
  const router = useRouter();
  const { user } = useAuth();

  const loginRoute = () => {
    router.push("/login");
  };

  useEffect(() => {
    // If there's an authenticated user, go to their page
    if (user?._id) {
      router.push(`/user/${user._id}`);
    }
  }, [user, router]);
  return (
    <div className=" flex flex-col h-screen">
      <main className="flex-grow pt-4 mt-4 ">
        {/* <div className="flex justify-center items-center " > */}
        <div className="flex flex-col justify-center items-center space-y-4">
          <h3>DO ME</h3>
          <p>
            Hello and welcome to <strong>DO ME</strong>. This is a todo app
            created by Linkits Digital
          </p>
          <p>
            Techniques used are <b>Nextjs</b> for frontend and backend and{" "}
            <b>mongoose</b> for database.
          </p>
          <p>
            Linkits Digital is a company that is known for a number of big
            products. One main one is the{" "}
            <Link
              target="-blank"
              className="link"
              href="https://wwww.linkitslibrary.com"
            >
              Linkits Library Records(LLR)
            </Link>{" "}
            which is widely used.
          </p>
          <button className="button" onClick={loginRoute}>
            LOGIN
          </button>
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
