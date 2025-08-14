import React from "react";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/main"); // Adjust the path as necessary
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      <div className="animate-bounce mb-4">
        <img src="/path/to/logo.png" alt="Logo" className="w-32 h-32" />
      </div>
      <h1 className="text-2xl font-bold text-white">One Click. Smarter Trades</h1>
      <button
        onClick={handleExploreClick}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Explore
      </button>
    </div>
  );
};

export default IntroPage;
