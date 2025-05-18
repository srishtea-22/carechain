// 'use client';
// import { useEffect, useState } from "react";
// import { loadContract } from "@/utils/contractUtils";

// // ✅ Define the medical record type
// interface MedicalRecord {
//   symptoms: string;
//   allergies: string;
//   bloodGroup: string;
//   prescription: string;
//   doctor: string;
// }

// export default function PatientDashboard() {
//   const [records, setRecords] = useState<MedicalRecord[]>([]);
//   const [contract, setContract] = useState<any>(null);
//   const [account, setAccount] = useState('');

//   useEffect(() => {
//     const init = async () => {
//       const data = await loadContract();
//       if (data) {
//         setContract(data.contract);
//         setAccount(data.account);

//         // Get raw data from contract
//         const rawRecords = await data.contract.methods.getMyRecords().call({ from: data.account });

//         // ✅ Format raw records into proper structure if needed
//         const formattedRecords: MedicalRecord[] = rawRecords.map((r: any) => ({
//           symptoms: r.symptoms,
//           allergies: r.allergies,
//           bloodGroup: r.bloodGroup,
//           prescription: r.prescription,
//           doctor: r.doctor
//         }));

//         setRecords(formattedRecords);
//       }
//     };
//     init();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Patient Dashboard</h1>
//       <div className="space-y-4 mt-4">
//         {records.map((rec, i) => (
//           <div key={i} className="border p-4 rounded shadow">
//             <p><b>Symptoms:</b> {rec.symptoms}</p>
//             <p><b>Allergies:</b> {rec.allergies}</p>
//             <p><b>Blood Group:</b> {rec.bloodGroup}</p>
//             <p><b>Prescription:</b> {rec.prescription}</p>
//             <p><b>Doctor Address:</b> {rec.doctor}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// 'use client';
// import { useState, useEffect } from 'react';
// import { loadContract } from '@/utils/contractUtils';

// export default function PatientDashboard() {
//   const [account, setAccount] = useState('');
//   const [contract, setContract] = useState<any>(null);
//   const [patientData, setPatientData] = useState({ name: '', allergy: '', bloodGroup: '' });

//   useEffect(() => {
//     async function init() {
//       const data = await loadContract();
//       if (data) {
//         setContract(data.contract);
//         setAccount(data.account);
//         // Fetch patient data from contract here, if any
//         const fetchedData = await data.contract.methods.getPatient(account).call({ from: account });
//         setPatientData(fetchedData);
//       }
//     }
//     init();
//   }, [account]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
//       <form className="space-y-4 max-w-md">
//         <div>
//           <label>Name</label>
//           <input type="text" value={patientData.name} readOnly className="border p-2 w-full" />
//         </div>
//         <div>
//           <label>Allergy</label>
//           <input type="text" value={patientData.allergy} readOnly className="border p-2 w-full" />
//         </div>
//         <div>
//           <label>Blood Group</label>
//           <input type="text" value={patientData.bloodGroup} readOnly className="border p-2 w-full" />
//         </div>
//       </form>
//     </div>
//   );
// }



// nichle run kr rha hai
// 'use client';
// import { useEffect, useState } from 'react';
// import { loadContract } from '@/utils/contractUtils';

// export default function PatientDashboard() {
//   const [account, setAccount] = useState('');
//   const [contract, setContract] = useState<any>(null);
//   const [records, setRecords] = useState<any[]>([]);

//   useEffect(() => {
//     const init = async () => {
//       const data = await loadContract();
//       if (data) {
//         setContract(data.contract);
//         setAccount(data.account);

//         const result = await data.contract.methods.getMyRecords().call({ from: data.account });
//         setRecords(result);
//       }
//     };
//     init();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
//       {records.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <div className="space-y-4">
//           {records.map((rec, index) => (
//             <div key={index} className="border p-4 rounded shadow">
//               <p><strong>Symptoms:</strong> {rec.symptoms}</p>
//               <p><strong>Allergies:</strong> {rec.allergies}</p>
//               <p><strong>Blood Group:</strong> {rec.bloodGroup}</p>
//               <p><strong>Prescription:</strong> {rec.prescription}</p>
//               <p><strong>Doctor:</strong> {rec.doctor}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
//upr run kr rha hai



'use client';
import { useEffect, useState } from 'react';
import { loadContract } from '@/utils/contractUtils';
import { useRouter } from 'next/navigation';

type MedicalRecord = {
  symptoms: string;
  allergies: string;
  bloodGroup: string;
  prescription: string;
  doctor: string;
};

export default function PatientDashboard() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState<any>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await loadContract();
        if (data) {
          setContract(data.contract);
          setAccount(data.account);
          
          const result = await data.contract.methods
            .getMyRecords()
            .call({ from: data.account });
          setRecords(result);
        }
      } catch (error) {
        console.error("Error loading records:", error);
        setError("Failed to load medical records. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const refreshRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await contract.methods
        .getMyRecords()
        .call({ from: account });
      setRecords(result);
    } catch (error) {
      console.error("Error refreshing records:", error);
      setError("Failed to refresh records. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800">Patient Dashboard</h1>
          {account && (
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-center font-medium">Loading your records...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Medical Records
              </h2>
              <button
                onClick={refreshRecords}
                className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Refresh
              </button>
            </div>

            {records.length === 0 ? (
              <div className="text-center py-12">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 mx-auto text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No medical records found
                </h3>
                <p className="mt-1 text-gray-500">
                  Your medical records will appear here once they're added by your doctor.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((rec, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Symptoms</h4>
                          <p className="mt-1 text-gray-800">{rec.symptoms || 'Not specified'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Allergies</h4>
                          <p className="mt-1 text-gray-800">{rec.allergies || 'None recorded'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Blood Group</h4>
                          <p className="mt-1 text-gray-800">{rec.bloodGroup || 'Not specified'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Prescription</h4>
                          <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                            {rec.prescription || 'No prescription provided'}
                          </p>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Doctor Address</h4>
                        <p className="mt-1 text-gray-800 font-mono">{rec.doctor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <button
              onClick={() => router.push('/dashboard/patient/request-blood')}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              See Available Donors
            </button>
    </div>
  );
}
