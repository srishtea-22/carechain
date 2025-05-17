'use client';

import { useEffect, useState } from 'react';

export default function DoctorDashboard() {
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">patient Dashboard</h1>


      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        check Medical Record
      </button>

      <button
        className="ml-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        Fetch Records
      </button>

      <h2 className="text-xl mt-6 mb-2 font-semibold">Patient Records</h2>

    </div>
  );
}