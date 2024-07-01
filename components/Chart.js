import {
  BarElement,
  CategoryScale,
  Colors,
  LineElement,
  LinearScale,
  PointElement,
  plugins,
} from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);
Chart.register(BarElement);
Chart.register(Colors);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

export const LineChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "Line Chart",
    },
    scales: {
      xAxes: [
        {
          type: "time",
          distribution: "series",
        },
      ],
      yAxes: [
        {
          type: "linear",
        },
      ],
    },
    colors: {
      enabled: true,
    },
  };

  return <Line data={data} options={options} />;
};

export const BarChartReact = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "Line Chart",
    },
    scales: {
      xAxes: [
        {
          type: "price",
          distribution: "series",
        },
      ],
      yAxes: [
        {
          type: "linear",
        },
      ],
    },
  };

  return <Bar data={data} options={options} />;
};


const BarChart = ({data}) => {
  const chartRef = useRef(null);
  const lable = data?.lable;
  const labelX = data?.labelX;
  const units = data?.labelY;

  useEffect(() => {
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }
    const context = chartRef.current.getContext("2d");

    const data = {
      labels: labelX,
      datasets: [
        {
          label: lable,
          data: units,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(11, 255, 0, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(11, 255, 0)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const config = {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        plugins: [ChartDataLabels],
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    const chart = new Chart(context, config);
    chartRef.current.chart = chart;
  }, []);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BarChart;
