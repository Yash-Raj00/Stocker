"use client";
import { useContext, useEffect, useRef, useState } from "react"; 
import { useRouter } from "next/navigation";
import BarChart from "@/components/Chart";
import Link from "next/link";
import { BiSolidEdit } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import shoebg from "@/public/shoes-bg-color.jpg";
import { shortSalesData } from "../Utils/soldthismonth";
import Loading from "@/components/Loading";
import UserContext from "../context/UserContext";

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const searchAreaRef = useRef(null);
  // const stockRef = useRef(null);/
  const [search, setSearch] = useState("");
  const [styleQuery, setStyleQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);
  const [searchData, setSearchData] = useState([]);
  const [addeddProductNoti, setAddedProductNoti] = useState(false);
  const [productForm, setProductForm] = useState({
    "product-name": "",
    description: "",
    style: "",
    category: "",
    quantity: "",
    price: "",
    sizes: [],
  });
  const [stocks, setStocks] = useState([]);
  const [stockEditView, setStockEditView] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !searchAreaRef.current.contains(e.target)) {
      setIsDropdownVisible(false);
    }
  };

  const setProfileInfo = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.success) router.push("/login");
      console.log(data.user);
      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setProfileInfo();
    // if(!user) {
    //   router.push("/login");
    // }
    document.addEventListener("mousedown", handleClickOutside);
    const getStocks = async () => {
      try {
        const response = await fetch("api/product");
        const data = await response.json();
        // console.log(data);
        console.log(data);
        setStocks(data.products);
      } catch (error) {
        console.log(error);
      }
    };
    getStocks();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    setIsDropdownVisible(true);
    setSearch(e.target.value);
    if (e.target.value.trim().length > 0) {
      const newStyleQuery =
        styleQuery === "all"
          ? ""
          : styleQuery.charAt(0).toUpperCase() + styleQuery.slice(1);
      try {
        console.log(search, styleQuery, "searching...");
        const response = await fetch(
          "api/product/search?query=" +
            e.target.value.trim() +
            "&styleQuery=" +
            newStyleQuery
        );
        const data = await response.json();
        console.log(data);
        setSearchData(data.products);
      } catch (error) {
        console.log("Error while searching: ", error);
      }
    } else {
      setSearchData([]);
    }
  };

  const handleFormChange = (e) => {
    if (
      e.target.name === "6" ||
      e.target.name === "7" ||
      e.target.name === "8" ||
      e.target.name === "9" ||
      e.target.name === "10" ||
      e.target.name === "11" ||
      e.target.name === "12" ||
      e.target.name === "13" ||
      e.target.name === "14" ||
      e.target.name === "15"
    ) {
      console.log(productForm.sizes, "sizes");
      const { value, checked } = e.target;
      setProductForm((productForm) => {
        const newSizes = checked
          ? [...productForm.sizes, value]
          : productForm.sizes.filter((size) => size !== value);
        return { ...productForm, sizes: newSizes };
      });
      return;
    }
    setProductForm({
      ...productForm,
      [e.target.name]:
        e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
    });
  };

  const addProduct = async () => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });
      if (response.ok) {
        setAddedProductNoti(true);
        const form = document.querySelector("form");
        form.reset();
        const checkboxes = document.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
        setProductForm({
          "product-name": "",
          description: "",
          style: "",
          category: "",
          quantity: "",
          price: "",
          sizes: [],
        });
        const newStocks = stocks;
        newStocks.push(productForm);
        setStocks(newStocks);
        setTimeout(() => {
          setAddedProductNoti(false);
        }, 5000);
      } else {
        console.log("Error adding product");
      }
    } catch (error) {
      console.log("Error", error);
    }
    console.log(productForm);
  };

  const changeQty = async (action, slug, currQty) => {
    try {
      setActionLoading(true);
      const response = await fetch("/api/action", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action, currQty }),
      });
      // const data = await response.json();
      // console.log(data);
      let index = searchData.findIndex((item) => item["product-name"] === slug);
      const newSearchData = JSON.parse(JSON.stringify(searchData)); // COOL NEW LEARNING...... DEEP COPY OF AN ARRAY || but meko lag ra normal copy se bhi same work karega.
      newSearchData[index].quantity =
        parseInt(newSearchData[index].quantity) + action;
      setSearchData(newSearchData);
      const newStocks = JSON.parse(JSON.stringify(stocks));
      index = stocks.findIndex((item) => item["product-name"] === slug);
      newStocks[index].quantity = parseInt(newStocks[index].quantity) + action;
      setStocks(newStocks);
      setActionLoading(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <>
      {user ? (
        <main className="main mx-auto max-w-[100rem] flex flex-col">
          <div className="h-[91.2vh] max-h-[50rem] relative flex flex-col justify-cent pt-32 gap-32 lg:gap-24">
            <div
              style={{
                background: `url(${shoebg.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-full h-full opacity-50 fixed top-16 right-0 -z-10"
            ></div>
            <h1 className="font-semibold text-5xl px-10 py-4 text-center bg-white/70 backdrop-blur-sm">
              Admin Dashboard
            </h1>
            <div className="search px-5 sm:px-12 md:px-16 lg:px-32 xl:px-64">
              <div className="border-2 rounded-md border-gray-300 bg-white/70 backdrop-blur-sm h-36 px-3 pb-2.5 flex flex-col justify-center gap-2 shadow-lg shadow-gray-500/40">
                <h2 className="text-3xl mb-2 font-semibold">Search Product</h2>
                <div
                  ref={searchAreaRef}
                  className="flex flex-col sm:flex-row gap-1"
                >
                  <div className="searchArea w-full lg:w-2/3 relative">
                    <input
                      value={search}
                      onChange={handleSearch}
                      id="search"
                      type="text"
                      // placeholder="search name"
                      placeholder="if value hai, to each time style change karne pe do search"
                      className="w-full border-2 border-red-400/80 px-2 py-0.5 rounded shadow"
                    />
                    {isDropdownVisible && search.trim().length ? (
                      <ul
                        ref={dropdownRef}
                        className="list bg-red-200 absolute w-full rounded shadow shadow-gray-400"
                      >
                        {searchData.map((item, i) => (
                          <li
                            key={i}
                            className="flex justify-between px-2 py-1 border-b border-red-200"
                          >
                            <div className="flex gap-1 items-center">
                              <span>{item["product-name"]}</span>
                              <span className="text-sm text-green-600">
                                (₹{item.price})
                              </span>
                            </div>
                            <div className="w-1/4 flex justify-between items-center">
                              <div className="">
                                <button
                                  onClick={() =>
                                    changeQty(
                                      -1,
                                      item["product-name"],
                                      item.quantity
                                    )
                                  }
                                  className={`${
                                    actionLoading
                                      ? "bg-red-300 cursor-wait"
                                      : "bg-red-500"
                                  } px-1 sm:px-2 rounded shadow-md text-white h-4 sm:h-full flex items-center`}
                                >
                                  -
                                </button>
                              </div>
                              <span className="mx-0.5 md:mx-3 text-xs md:text-sm flex items-center">
                                {item.quantity}
                                <span className="text-gray-500/90 text-xs hidden sm:inline-block">
                                  qty
                                </span>
                              </span>
                              <div className="flex items-center justify-start">
                                <button
                                  onClick={() =>
                                    changeQty(
                                      1,
                                      item["product-name"],
                                      item.quantity
                                    )
                                  }
                                  className={`${
                                    actionLoading
                                      ? "bg-red-300 cursor-wait"
                                      : "bg-red-500"
                                  } px-1 sm:px-1.5 self-center rounded shadow-md text-white h-4 sm:h-full flex items-center`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}
                  </div>
                  <select
                    value={styleQuery}
                    onChange={(e) => setStyleQuery(e.target.value)}
                    name="style"
                    id="style"
                    className="bg-red-400/80 border-gray-300 border rounded min:w-1/4 text-center shadow cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="sneakers">Sneakers</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="running">Running Shoes</option>
                    <option value="boots">Boots</option>
                    <option value="sandals">Sandals</option>
                    <option value="heels">Heels</option>
                    <option value="flats">Flats</option>
                    <option value="loafers">Loafers</option>
                    <option value="oxfords">Oxfords</option>
                    <option value="slippers">Slippers</option>
                    <option value="wedges">Wedges</option>
                    <option value="espadrilles">Espadrilles</option>
                    <option value="clogs">Clogs</option>
                    <option value="athletic">Athletic Shoes</option>
                    <option value="dress">Dress Shoes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div
            id="add"
            className="add bg-red-400 shadow-xl shadow-red-400/40 py-12"
          >
            <h2 className="text-3xl mx-5 sm:mx-12 md:mx-20 xl:mx-64 mb-6 font-semibold border-b-2 border-black">
              Add Product&#40;s&#41;
            </h2>
            <form className="pt-2 pb-4 flex flex-col gap-2 px-5 sm:px-12 md:px-20 lg:px-32 xl:px-64">
              <div className="flex flex-col text-sm md:text-base">
                <label
                  className="text-gray-100/90 font-semibold ml-2"
                  htmlFor="product-name"
                >
                  Product Name
                </label>
                <input
                  onChange={handleFormChange}
                  value={productForm["product-name"]}
                  className="px-2 py-0.5 rounded-md shadow-sm shadow-gray-400"
                  id="product-name"
                  type="text"
                  name="product-name"
                  placeholder="shoe name"
                />
              </div>
              <div className="flex flex-col text-sm md:text-base">
                <label
                  className="text-gray-100/90 font-semibold ml-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  onChange={handleFormChange}
                  value={productForm?.description}
                  className="px-2 py-0.5 rounded-md shadow-sm shadow-gray-400"
                  id="description"
                  type="text"
                  name="description"
                  placeholder="shoe description"
                />
              </div>
              <div className="flex flex-col text-sm md:text-base">
                <label
                  className="text-gray-100/90 font-semibold ml-2"
                  htmlFor="style"
                >
                  Style
                </label>
                <select
                  onChange={handleFormChange}
                  selected={productForm?.style}
                  name="style"
                  id="style"
                  className="px-1 py-0.5 rounded-md shadow-sm shadow-gray-400"
                >
                  <option className="bg-red-100" value="select">
                    Select
                  </option>
                  <option className="bg-red-100" value="sneakers">
                    Sneakers
                  </option>
                  <option className="bg-red-100" value="sneakers">
                    Formal
                  </option>
                  <option className="bg-red-100" value="sneakers">
                    Casual
                  </option>
                  <option className="bg-red-100" value="running">
                    Running Shoes
                  </option>
                  <option className="bg-red-100" value="boots">
                    Boots
                  </option>
                  <option className="bg-red-100" value="sandals">
                    Sandals
                  </option>
                  <option className="bg-red-100" value="heels">
                    Heels
                  </option>
                  <option className="bg-red-100" value="flats">
                    Flats
                  </option>
                  <option className="bg-red-100" value="loafers">
                    Loafers
                  </option>
                  <option className="bg-red-100" value="oxfords">
                    Oxfords
                  </option>
                  <option className="bg-red-100" value="slippers">
                    Slippers
                  </option>
                  <option className="bg-red-100" value="wedges">
                    Wedges
                  </option>
                  <option className="bg-red-100" value="espadrilles">
                    Espadrilles
                  </option>
                  <option className="bg-red-100" value="clogs">
                    Clogs
                  </option>
                  <option className="bg-red-100" value="athletic">
                    Athletic Shoes
                  </option>
                  <option className="bg-red-100" value="dress">
                    Dress Shoes
                  </option>
                </select>
              </div>
              <div className="flex flex-col text-sm md:text-base">
                <label
                  className="text-gray-100/90 font-semibold ml-2"
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  onChange={handleFormChange}
                  selected={productForm?.category}
                  name="category"
                  id="category"
                  className="px-1 py-0.5 rounded-md shadow-sm shadow-gray-400"
                >
                  <option className="bg-red-100" value="select">
                    Select
                  </option>
                  <option className="bg-red-100" value="kids">
                    Kids
                  </option>
                  <option className="bg-red-100" value="boys">
                    Boys
                  </option>
                  <option className="bg-red-100" value="girls">
                    Girls
                  </option>
                  <option className="bg-red-100" value="men">
                    Men
                  </option>
                  <option className="bg-red-100" value="women">
                    Women
                  </option>
                  <option className="bg-red-100" value="uni">
                    Uni
                  </option>
                </select>
              </div>
              <div className="flex flex-col text-sm md:text-base">
                <label
                  className="text-gray-100/90 font-semibold ml-2"
                  htmlFor="quantity"
                >
                  Quantitiy
                </label>
                <input
                  onChange={handleFormChange}
                  value={productForm?.quantity}
                  className="px-2 py-0.5 rounded-md shadow-sm shadow-gray-400"
                  id="quantity"
                  type="number"
                  name="quantity"
                  placeholder="available volume"
                />
              </div>
              <div className="flex flex-col text-sm md:text-base">
                <label
                  className="text-gray-100/90 font-semibold ml-2"
                  htmlFor="Price"
                >
                  Price
                </label>
                <input
                  onChange={handleFormChange}
                  value={productForm?.price}
                  className="px-2 py-0.5 rounded-md shadow-sm shadow-gray-400"
                  id="Price"
                  type="number"
                  name="price"
                  placeholder="mrp/-"
                />
              </div>
              <div className="flex flex-col text-sm md:text-base">
                <p className="text-gray-100/90 font-semibold ml-2">Sizes</p>
                <div className="flex flex-wrap gap-x-6 bg-white shadow-sm shadow-gray-400 px-2 py-0.5 rounded-md">
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="6"
                      id="6"
                      value={6}
                    />
                    <label className="cursor-pointer" htmlFor="6">
                      6
                    </label>
                  </span>
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="7"
                      id="7"
                      value={7}
                    />
                    <label className="cursor-pointer" htmlFor="7">
                      7
                    </label>
                  </span>
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="8"
                      id="8"
                      value={8}
                    />
                    <label className="cursor-pointer" htmlFor="8">
                      8
                    </label>
                  </span>
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="9"
                      id="9"
                      value={9}
                    />
                    <label className="cursor-pointer" htmlFor="9">
                      9
                    </label>
                  </span>
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="10"
                      id="10"
                      value={10}
                    />
                    <label className="cursor-pointer" htmlFor="10">
                      10
                    </label>
                  </span>
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="11"
                      id="11"
                      value={11}
                    />
                    <label className="cursor-pointer" htmlFor="11">
                      11
                    </label>
                  </span>
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="12"
                      id="12"
                      value={12}
                    />
                    <label className="cursor-pointer" htmlFor="12">
                      12
                    </label>
                  </span>
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="13"
                      id="13"
                      value={13}
                    />
                    <label className="cursor-pointer" htmlFor="13">
                      13
                    </label>
                  </span>
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="14"
                      id="14"
                      value={14}
                    />
                    <label className="cursor-pointer" htmlFor="14">
                      14
                    </label>
                  </span>
                  <span className="flex gap-0.5">
                    <input
                      onChange={handleFormChange}
                      className="checkbox cursor-pointer"
                      type="checkbox"
                      name="15"
                      id="15"
                      value={15}
                    />
                    <label className="cursor-pointer" htmlFor="15">
                      15
                    </label>
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addProduct();
                  }}
                  className="bg-red-600 text-white px-6 py-2 w-full sm:w-fit shadow-md rounded-md font-semibold hover:scale-[1.03] transition hover:bg-red-700"
                >
                  Add Item
                </button>
              </div>
            </form>
            {addeddProductNoti && (
              <h3 className="text-green-400 bg-gray-50 px-6 py-1 rounded-full w-fit mx-auto text-center font-semibold text-lg mt-4">
                Product(s) Added Successfully!
              </h3>
            )}
          </div>
          <div className="flex flex-col pt-16 px-3 sm:px-12 md:px-20 lg:px-32 xl:px-64 gap-16 bg-white backdrop-blur-sm bbbg-gradient-to-b from-red-400 to-white">
            <div id="stock" className="stock py-4">
              <div className="mb-6 xl:mx-1 border-b-2 font-semibold border-black flex justify-between items-end">
                <h2 className="w-fit text-3xl">Current Stock</h2>
                <Link
                  href={"/admin/edit-stock"}
                  className="flex items-center gap-1 text-base text-gray-50 w-[90px] justify-center bg-red-500 mb-0.5 rounded-lg hover:scale-[1.03] transition-all"
                >
                  Edit
                  <BiSolidEdit className="" />
                </Link>
              </div>
              {stocks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-[600px] md:w-full border-t text-left">
                    <thead className="">
                      <tr className="border-b">
                        <th className="px-2 py-1 border">Product Name</th>
                        <th className="px-2 py-1 border">Style</th>
                        <th className="px-2 py-1 border">Quantity</th>
                        <th className="px-2 py-1 border">Sizes</th>
                        <th className="px-2 py-1 border">Price</th>
                        <th className="px-2 py-1 border">Category</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm md:text-base">
                      {stocks.length > 0
                        ? stocks.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-2 border">
                                {item["product-name"]}
                              </td>
                              <td className="px-2 border">{item?.style}</td>
                              <td className="px-2 border">{item?.quantity}</td>
                              <td className="px-2 border">
                                {item?.sizes.join(",")}
                              </td>
                              <td className="px-2 border">{item?.price}</td>
                              <td className="px-2 border">{item?.category}</td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>
              ) : (
                <img
                  src="/car-loader-unscreen.gif"
                  alt="loading"
                  className="mx-auto blend"
                />
              )}
            </div>
            <div id="sales" className="salesGraph py-4 flex flex-col gap-1">
              <div className="mb-6 xl:mx-1 border-b-2 font-semibold border-black flex justify-between items-end">
                <h2 className="w-fit text-3xl">Sales Chart</h2>
                <Link
                  href={"/admin/sales-details"}
                  className="flex items-center gap-1 text-base text-gray-50 w-[90px] justify-center bg-red-500 mb-0.5 rounded-lg hover:scale-[1.03] transition-all"
                >
                  Details
                  <TbReportSearch className="h-[17px] w-[17px]" />
                </Link>
              </div>
              <div className="overflow-x-scroll">
                <div className="min-w-[700px] w-full lg:w-[90%] py-4">
                  <BarChart data={shortSalesData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <Loading />
      )}
    </>
  );
}
