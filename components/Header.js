"use client";
import UserContext from "@/app/context/UserContext";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import profileImg from "@/public/profile.jpg";
import logo from "@/public/stocker-logo.jpg";
import { FiUser, FiLogOut } from "react-icons/fi";
import { TbUserEdit } from "react-icons/tb";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  console.log("PATH---", pathname);
  const { user, setUser } = useContext(UserContext);

  // console.log("user", user);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropProfile, setDropProfile] = useState(false);
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        console.log(user);
        setUser(null);
        console.log(user);
        setDropProfile(false);
        router.push("/login");
        console.log(data);
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div className="sticky top-0 w-full z-10">
      <nav className="bg-black/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* <!-- Mobile menu button--> */}
              <button
                onClick={() => setMobileMenu((mobileMenu) => !mobileMenu)}
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="absolute -inset-0.5"></span>
                {/* <span className="sr-only">Open main menu</span>
          <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          --> */}
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                {/* <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          --> */}
                <svg
                  className="hidden h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div
                className="flex items-center pt-0.5 rounded outline outline-transparent hover:outline-blue-700 bg-[rgb(51, 51, 51)]
              bg-[#333333] transition-all duration-300"
              >
                <img
                  className="h-11 w-auto invert mix-blend-plus-lighter rounded"
                  src={logo.src}
                  alt="Your Company"
                />
              </div>
              <div className="hidden sm:ml-6 sm:flex">
                <div className="flex space-x-4 items-center justify-center">
                  <Link
                    href="/"
                    className={`${ pathname === "/dashboard" ? "bg-blue-700/30" : ""} hover:bg-blue-700/60 text-white rounded-md px-3 py-2 text-sm font-medium`}
                    aria-current="page"
                  >
                    Dashboard
                  </Link>
                  {pathname === "/dashboard" ? (
                    <>
                      <Link
                        href="#stock"
                        className="text-gray-300 hover:bg-blue-700/60 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Stock
                      </Link>
                      <Link
                        href="#sales"
                        className="text-gray-300 hover:bg-blue-700/60 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Sales
                      </Link>{" "}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() =>
                      setDropProfile((dropProfile) => !dropProfile)
                    }
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={profileImg.src}
                      alt="dp"
                    />
                  </button>
                </div>
                {dropProfile ? (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 min-h-26 origin-top-right rounded-md bg-gray-200/80 backdrop-blur py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    {user ? (
                      <div className="flex flex-col justify-between gap-2 px-3.5 py-2">
                        <div
                          href="#"
                          className="text-gray-700 ml-0.5 flex gap-2 items-center h-fit w-fit [&_img] transition hover:scale-105"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-0"
                        >
                          <FiUser className="w-[22px] h-[22px]" />
                          <span className="text-blue-700 text-base font-semibold">
                            {user?.username}
                          </span>
                        </div>
                        {/* <Link
                          href="#"
                          className="text-sm text-gray-700 flex gap-1.5 items-center w-fit transition hover:scale-105"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-1"
                        >
                          <TbUserEdit className="w-6 h-6" />
                          Account Settings
                        </Link> */}
                        <button
                          onClick={handleLogout}
                          href="#"
                          className="text-sm text-gray-700 ml-0.5 flex gap-2 items-center w-fit transition hover:scale-105"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-2"
                        >
                          <FiLogOut className="w-5 h-5" />
                          Log Out
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-24 flex flex-col justify-center items-center gap-1">
                        <Link
                          onClick={() => setDropProfile(!dropProfile)}
                          href={"/login"}
                          className="rounded-lg"
                        >
                          <button className="bg-blue-700 text-white py-1 px-4 rounded-lg hover:bg-blue-500 active:bg-blue-800 transition">
                            Log In
                          </button>
                        </Link>
                        <h3 className="text-black">to see your profile</h3>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Mobile menu, show/hide based on menu state. --> */}
        <div
          className={` ${mobileMenu ? "" : "hidden"} sm:hidden`}
          id="mobile-menu"
        >
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/dashboard"
              className={`${ pathname === "/dashboard" ? "bg-blue-700/30" : ""} hover:bg-blue-700/60 text-white block rounded-md px-3 py-2 text-base font-medium`}
              aria-current="page"
            >
              Dashboard
            </Link>
            {pathname === "/dashboard" ? (
              <>
                <Link
                  href="#stock"
                  className="text-gray-300 hover:bg-blue-700/60 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                >
                  Stock
                </Link>
                <Link
                  href="#sales"
                  className="text-gray-300 hover:bg-blue-700/60 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                >
                  Sales
                </Link>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
