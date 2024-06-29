"use client";
import React, { useEffect, useRef, useState } from "react";
import BarChart from "@/components/Chart";
import { shortSalesData } from "@/app/Utils/soldthismonth";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";

const detailssales = () => {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const productsRef = useRef();

  // Products and Prices Chart Data
  const priceChartLable = "Products and Prices";
  const [shoesArray, setShoesArray] = useState();
  const priceArray = [
    "1499",
    "2499",
    "3499",
    "4499",
    "6999",
    "11999",
    "20000",
    "1499",
    "2499",
    "3499",
    "20000",
  ];

  // setTimeout(() => {
  // }, 2000);

  useEffect(() => {
    setShoesArray([
      "Yash",
      "Symba",
      "Zara Y9",
      "Nike",
      "Adidas",
      "Zara Y1",
      "Zara Y2",
      "Amul Macho",
      "Joota",
      "High",
      "Laalalala",
    ]);
    console.log(shoesArray);
    //   const getStocks = async () => {
    //     try {
    //       const response = await fetch("http://localhost:3000/api/product");
    //       const data = await response.json();
    //       console.log(data);
    //       const array = data.products.map((shoe) => shoe["product-name"]);
    //       setShoesArray(array);
    //       console.log(shoesArray)
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };
    //   getStocks();
  }, []);
  console.log(shoesArray);

  return (
    <div className="min-h-[91vh] bg-gray-200 flex flex-col gap-4 py-10 px-4 md:px-20">
      <h1 className="text-3xl md:text-4xl text-blue-600 flex flex-wrap gap-1 justify-center">
        Details and Analysis
        <TbDeviceDesktopAnalytics className="inline-block w-10 h-10" />
      </h1>
      <div className=" flex flex-col justify-center md:flex-row flex-wrap gap-3 my-4">
        <div className="bg-white w-full xl:w-[49.5%] flex flex-col gap-1 md:gap-2 pt-2 md:pt-4 md:pb-5 md:px-5 rounded-md">
          <h2 className="text-xl md:text-2xl font-semibold ml-5">Sales in {month}</h2>
          <div className="overflow-auto">
            <div className="bg-gray-200/70 min-w-[600px] md:bg-gray-200/80 p-5 rounded-md">
              <BarChart data={shortSalesData} />
            </div>
          </div>
        </div>
        <div className="bg-white w-full xl:w-[49.5%] flex flex-col gap-1 md:gap-2 pt-2 md:pt-4 md:pb-5 md:px-5 rounded-md">
          <h2 className="text-xl md:text-2xl font-semibold ml-5">Products and Prices</h2>
          <div className="overflow-auto">
            <div className="bg-gray-200/70 min-w-[600px] md:bg-gray-200/80 p-5 rounded-md">
              <BarChart
                data={{
                  lable: priceChartLable,
                  labelX: shoesArray,
                  labelY: priceArray,
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white w-full xl:w-[49.5%] flex flex-col gap-1 md:gap-2 pt-2 md:pt-4 md:pb-5 md:px-5 rounded-md">
          <h2 className="text-xl md:text-2xl font-semibold ml-5">Products and Prices</h2>
          <div className="overflow-auto">
            <div className="bg-gray-200/70 min-w-[600px] md:bg-gray-200/80 p-5 rounded-md">
              <BarChart
                data={{
                  lable: priceChartLable,
                  labelX: shoesArray,
                  labelY: priceArray,
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white w-full xl:w-[49.5%] flex flex-col gap-1 md:gap-2 pt-2 md:pt-4 md:pb-5 md:px-5 rounded-md">
          <h2 className="text-xl md:text-2xl font-semibold ml-5">Sales in {month}</h2>
          <div className="overflow-auto">
            <div className="bg-gray-200/70 min-w-[600px] md:bg-gray-200/80 p-5 rounded-md">
              <BarChart data={shortSalesData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default detailssales;
