'use client';
import { useState } from 'react';
import { findMatchingDonors } from '@/utils/contractUtils';

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodRequestPage() {
  const [bloodType, setBloodType] = useState("");
  const [donors, setDonors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const matches = await findMatchingDonors(bloodType);
    //   setDonors(matches.filter(addr => addr !== '0x0000000000000000000000000000000000000000'));
    setDonors(matches.filter((addr: string) => addr !== '0x0000000000000000000000000000000000000000'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Find Blood Donors</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Required Blood Type
          </label>
          <select
            className="w-full p-2 border rounded"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
          >
            <option value="">Select required blood type</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <button
          className={`w-full py-2 px-4 rounded text-white 
            ${bloodType ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={handleSearch}
          disabled={!bloodType || isLoading}
        >
          {isLoading ? "Searching..." : "Find Matching Donors"}
        </button>

        {donors.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">Available Donors:</h2>
            <ul className="space-y-2">
              {donors.map((address, index) => (
                <li key={index} className="p-3 bg-gray-50 rounded border">
                  <span className="font-mono">{address}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}