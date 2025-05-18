// 'use client';

// import { useEffect, useState } from 'react';

// export default function DoctorDashboard() {
  
//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">donor Dashboard</h1>


//       <button
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Upload details
//       </button>

//       <button
//         className="ml-4 bg-gray-600 text-white px-4 py-2 rounded"
//       >
//         Fetch Records
//       </button>

//       <h2 className="text-xl mt-6 mb-2 font-semibold">Patient Records</h2>

//     </div>
//   );
// }





'use client';
import { useState } from 'react';
import { registerAsDonor } from '@/utils/contractUtils';

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonorPage() {
  const [bloodType, setBloodType] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      await registerAsDonor(bloodType);
      setIsRegistered(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Blood Donor Registration</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blood Type
          </label>
          <select
            className="w-full p-2 border rounded"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
          >
            <option value="">Select your blood type</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <button
          className={`w-full py-2 px-4 rounded text-white 
            ${bloodType ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={handleRegister}
          disabled={!bloodType}
        >
          {isRegistered ? "Thank You for Registering!" : "Register as Donor"}
        </button>
      </div>
    </div>
  );
}