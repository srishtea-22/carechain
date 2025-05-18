//run kr rha hai ye wala
// 'use client'; 
// import { useEffect, useState } from "react";
// import { loadContract } from "@/utils/contractUtils";

// type MedicalRecord = {
//   symptoms: string;
//   allergies: string;
//   bloodGroup: string;
//   prescription: string;
//   doctor: string;
// };

// export default function DoctorDashboard() {
//   const [account, setAccount] = useState('');
//   const [contract, setContract] = useState<any>(null);
//   const [form, setForm] = useState({ referenceId: '', name: '', speciality: '', degree: '', experience: '' });
//   const [recordForm, setRecordForm] = useState({ patient: '', symptoms: '', allergies: '', bloodGroup: '', prescription: '' });
//   const [records, setRecords] = useState<MedicalRecord[]>([]);

//   useEffect(() => {
//     const init = async () => {
//       const data = await loadContract();
//       if (data) {
//         setContract(data.contract);
//         setAccount(data.account);
//       }
//     };
//     init();
//   }, []);

//   const registerDoctor = async () => {
//     const { referenceId, name, speciality, degree, experience } = form;
//     await contract.methods.registerDoctor(referenceId, name, speciality, degree, experience)
//       .send({ from: account });
//     alert("Doctor registered!");
//   };

//   const addRecord = async () => {
//     const { patient, symptoms, allergies, bloodGroup, prescription } = recordForm;
//     await contract.methods.addMedicalRecord(patient, symptoms, allergies, bloodGroup, prescription)
//       .send({ from: account });
//     alert("Medical record added!");
//   };

//   const fetchPatientRecords = async () => {
//     const data = await contract.methods.getPatientRecords(recordForm.patient).call({ from: account });
//     setRecords(data);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Doctor Dashboard</h1>

//       <div className="bg-white p-4 rounded shadow space-y-2">
//         <h2 className="font-semibold">Register Doctor</h2>
//         {Object.keys(form).map(key => (
//           <input
//             key={key}
//             className="border p-2 w-full"
//             placeholder={key}
//             onChange={(e) => setForm({ ...form, [key]: e.target.value })}
//           />
//         ))}
//         <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={registerDoctor}>Submit</button>
//       </div>

//       <div className="bg-white p-4 rounded shadow space-y-2">
//         <h2 className="font-semibold">Add Medical Record</h2>
//         {Object.keys(recordForm).map(key => (
//           <input
//             key={key}
//             className="border p-2 w-full"
//             placeholder={key}
//             onChange={(e) => setRecordForm({ ...recordForm, [key]: e.target.value })}
//           />
//         ))}
//         <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={addRecord}>Add Record</button>
//       </div>

//       <div className="bg-white p-4 rounded shadow space-y-2">
//         <h2 className="font-semibold">Fetch Patient Records</h2>
//         <input
//           className="border p-2 w-full"
//           placeholder="Patient Wallet Address"
//           onChange={(e) => setRecordForm({ ...recordForm, patient: e.target.value })}
//         />
//         <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={fetchPatientRecords}>Fetch</button>

//         {records.length > 0 && (
//           <div className="mt-4">
//             <h3 className="font-semibold">Records:</h3>
//             {records.map((rec, i) => (
//               <div key={i} className="p-2 border my-2">
//                 <p><b>Symptoms:</b> {rec.symptoms}</p>
//                 <p><b>Allergies:</b> {rec.allergies}</p>
//                 <p><b>Blood Group:</b> {rec.bloodGroup}</p>
//                 <p><b>Prescription:</b> {rec.prescription}</p>
//                 <p><b>Doctor:</b> {rec.doctor}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
//run kr rha upr




'use client';
import { useEffect, useState } from "react";
import { loadContract } from "@/utils/contractUtils";

type MedicalRecord = {
  symptoms: string;
  allergies: string;
  bloodGroup: string;
  prescription: string;
  doctor: string;
};

export default function DoctorDashboard() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState<any>(null);
  const [form, setForm] = useState({ 
    referenceId: '', 
    name: '', 
    speciality: '', 
    degree: '', 
    experience: '' 
  });
  const [recordForm, setRecordForm] = useState({ 
    patient: '', 
    symptoms: '', 
    allergies: '', 
    bloodGroup: '', 
    prescription: '' 
  });
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [activeTab, setActiveTab] = useState('register');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await loadContract();
        if (data) {
          setContract(data.contract);
          setAccount(data.account);
          
          // Check if doctor is already registered
          if (data.contract.methods.isDoctorRegistered) {
            const registered = await data.contract.methods
              .isDoctorRegistered(data.account)
              .call();
            setIsRegistered(registered);
          }
        }
      } catch (error) {
        console.error("Error loading contract:", error);
        setError("Failed to load contract. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const registerDoctor = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { referenceId, name, speciality, degree, experience } = form;
      
      if (!contract?.methods?.registerDoctor) {
        throw new Error("Contract doesn't support doctor registration");
      }
      
      await contract.methods.registerDoctor(
        referenceId, 
        name, 
        speciality, 
        degree, 
        experience
      ).send({ from: account });
      
      setIsRegistered(true);
      setForm({ referenceId: '', name: '', speciality: '', degree: '', experience: '' });
      setSuccessMessage("Doctor registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      setError(`Registration failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addRecord = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { patient, symptoms, allergies, bloodGroup, prescription } = recordForm;
      
      if (!contract?.methods?.addMedicalRecord) {
        throw new Error("Contract doesn't support adding medical records");
      }
      
      await contract.methods.addMedicalRecord(
        patient, 
        symptoms, 
        allergies, 
        bloodGroup, 
        prescription
      ).send({ from: account });
      
      setRecordForm({ ...recordForm, symptoms: '', allergies: '', bloodGroup: '', prescription: '' });
      setSuccessMessage("Medical record added successfully!");
    } catch (error) {
      console.error("Record addition error:", error);
      setError(`Failed to add medical record: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientRecords = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (!contract?.methods?.getPatientRecords) {
        throw new Error("Contract doesn't support fetching patient records");
      }
      
      const data = await contract.methods.getPatientRecords(recordForm.patient).call({ from: account });
      setRecords(data);
      if (data.length === 0) {
        setSuccessMessage("No records found for this patient.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(`Failed to fetch records: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Messages Section */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
              <button onClick={clearMessages} className="text-red-700 hover:text-red-900">
                ✕
              </button>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">Success</p>
                <p>{successMessage}</p>
              </div>
              <button onClick={clearMessages} className="text-green-700 hover:text-green-900">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800">Doctor Dashboard</h1>
          {account && (
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </div>
              {isRegistered && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  Registered Doctor
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-center font-medium">Processing transaction...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {/* Tabs Navigation */}
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'register' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('register')}
            >
              {isRegistered ? 'Doctor Info' : 'Doctor Registration'}
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'records' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('records')}
              disabled={!isRegistered}
            >
              Add Medical Record
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'view' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('view')}
              disabled={!isRegistered}
            >
              View Records
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'register' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isRegistered ? 'Your Doctor Information' : 'Register as a Doctor'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(form).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`}
                        value={value}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        disabled={isRegistered}
                      />
                    </div>
                  ))}
                </div>
                {!isRegistered && (
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={registerDoctor}
                    disabled={isLoading || Object.values(form).some(v => !v)}
                  >
                    Register Doctor
                  </button>
                )}
              </div>
            )}

            {activeTab === 'records' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Add Medical Record</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Wallet Address
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="Enter patient wallet address"
                      value={recordForm.patient}
                      onChange={(e) => setRecordForm({ ...recordForm, patient: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(recordForm)
                    .filter(([key]) => key !== 'patient')
                    .map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {key === 'prescription' ? (
                          <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition h-24"
                            placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`}
                            value={value}
                            onChange={(e) => setRecordForm({ ...recordForm, [key]: e.target.value })}
                          />
                        ) : (
                          <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`}
                            value={value}
                            onChange={(e) => setRecordForm({ ...recordForm, [key]: e.target.value })}
                          />
                        )}
                      </div>
                    ))}
                </div>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={addRecord}
                  disabled={isLoading || !recordForm.patient || !recordForm.symptoms}
                >
                  Add Medical Record
                </button>
              </div>
            )}

            {activeTab === 'view' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">View Patient Records</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Wallet Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Enter patient wallet address"
                        value={recordForm.patient}
                        onChange={(e) => setRecordForm({ ...recordForm, patient: e.target.value })}
                      />
                      <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={fetchPatientRecords}
                        disabled={isLoading || !recordForm.patient}
                      >
                        Fetch Records
                      </button>
                    </div>
                  </div>
                </div>

                {records.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Medical Records ({records.length})
                    </h3>
                    <div className="space-y-4">
                      {records.map((rec, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Symptoms</h4>
                              <p className="text-gray-800">{rec.symptoms}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Allergies</h4>
                              <p className="text-gray-800">{rec.allergies}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Blood Group</h4>
                              <p className="text-gray-800">{rec.bloodGroup}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Prescription</h4>
                              <p className="text-gray-800 whitespace-pre-wrap">{rec.prescription}</p>
                            </div>
                            <div className="md:col-span-2">
                              <h4 className="text-sm font-medium text-gray-500">Doctor</h4>
                              <p className="text-gray-800">{rec.doctor}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}