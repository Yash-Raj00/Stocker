// Sales Chart Data
export const salesData = {
  salesChartLable: "Units Sold This Month",
  prices: [
    "₹499-1499",
    "₹1500-2499",
    "₹2500-3499",
    "₹3500-4499",
    "₹4500-6999",
    "₹7000-11999",
    "₹12000-20000",
  ],
  units: [185, 165, 199, 280, 271, 240, 200],
};

export const shortSalesData = { lable: salesData.salesChartLable, labelX: salesData.prices, labelY: salesData.units }
