import React from "react";
// import handleSignup from ""

const RegisterButton = ({value, loading = false}) => {
  return (
    <button
      className={`${loading ? "bg-blue-300 hover:bg-blue-300 cursor-wait" : "bg-blue-700 hover:bg-blue-500"} w-full py-4 rounded-2xl text-white hover:scale-[1.01] transition active:bg-blue-800 font-semibold`}
    >
      {value}
    </button>
  );
};

export default RegisterButton;
