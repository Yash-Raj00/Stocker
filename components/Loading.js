import React from "react";
import "@/styles/loading.css"

const Loading = () => {
  return (
    <div className="container">
      <h1 className="text-4xl">Loading...</h1>
      <div className="loader">
        <div className="bar"></div>
      </div>
    </div>
  );
};

export default Loading;
