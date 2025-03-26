// src/TailwindTest.jsx
import React from 'react';

const TailwindTest = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
      <p className="text-lg text-gray-700">If you see this styled text, Tailwind CSS is working!</p>
      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Click Me
      </button>
    </div>
  );
};

export default TailwindTest;
