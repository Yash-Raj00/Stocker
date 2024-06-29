"use client";
import React, { useContext, useState } from "react";
import RegisterButton from "./RegisterButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserContext from "@/app/context/UserContext";
import Loading from "./Loading";

const LoginLayout = () => {
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [passwordVisibile, setPasswordVisibile] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    if (!form.email.trim() || !form.password.trim()) {
      return setError("Please provide all fields");
    }
    console.log(form);
    try {
      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success) {
        setError("");
        setUser(data.user);
        console.log(data.user);
        setLoading(false);
        router.push("/");
      } else {
        setLoading(false);
        setError(data.message);
      }
    } catch (error) {
      console.error("YASH ERROR", error);
    }
  };
  return (
    <>
      <main className="flex flex-col justify-center items-center gap-2 bg-gray-200 h-[92.4vh] sm:h-[91vh]">
        <div className="rounded md:w-96 h-[500px] px-6 sm:px-10 bg-white flex flex-col justify-between py-20 shadow">
          <h1 className="text-2xl font-semibold text-center">
            Log in to your Account
          </h1>
          <h3 className="text-red-500 text-center">{error}</h3>
          <div className="flex flex-col justify-center gap-8">
            <form className="flex flex-col justify-center items-center gap-3 ">
              <div className="flex items-center border-2 border-gray-400 rounded-2xl relative shadow bg-white w-fit">
                <span>
                  <img
                    src="envelope.svg"
                    alt="email"
                    className="w-6 opacity-40 absolute top-4 left-4"
                  />
                </span>
                <input
                  onChange={handleFormChange}
                  value={form.email}
                  name="email"
                  type="text"
                  placeholder="Email"
                  className="pl-14 p-4 font-semibold bg-transparent focus:outline-none rounded-2xl"
                />
              </div>
              <div className="flex items-center border-2 border-gray-400 rounded-2xl relative shadow bg-white w-fit">
                <span>
                  <img
                    src="lock.svg"
                    alt="password"
                    className="w-6 opacity-40 absolute top-3.5 left-4"
                  />
                </span>
                <input
                  onChange={handleFormChange}
                  value={form.password}
                  name="password"
                  type={passwordVisibile ? "text" : "password"}
                  placeholder="Password"
                  className="pl-14 p-4 font-semibold bg-transparent focus:outline-none rounded-2xl"
                />
                <span onClick={() => setPasswordVisibile(!passwordVisibile)}>
                  <img
                    src={passwordVisibile ? "eye-crossed.svg" : "eye.svg"}
                    alt="eye-open"
                    className="w-[18px] absolute top-5 right-2 opacity-60 cursor-pointer"
                  />
                </span>
              </div>
            </form>
            <div
              className="flex flex-col gap-2 justify-center items-center"
              >
              <div
              onClick={handleLogin}
              className="w-full rounded-2xl cursor-pointer"
            >
              {loading ? <RegisterButton value={"Logging In..."} loading={true} /> : <RegisterButton value={"Log In"} />}
            </div>
            <p className="text-blue-500">
              Don't have an account?{" "}
              <Link href={"/signup"} className="font-semibold text-black">
                Sign Up
                <img
                  src="arrow-small-right.svg"
                  alt="goTo"
                  className="w-5 inline-block"
                  />
              </Link>
            </p>
                  </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default LoginLayout;
