// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import useWallet from "@/hooks/useWallet";

// export default function Page() {
//   const { address, connectWallet, signMessage } = useWallet();
//   const [form, setForm] = useState({ name: "", email: "", role: "" });
//   const [message] = useState("Login to CareChain");
//   const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
//   const router = useRouter();

//   // Check if user is already registered
//   useEffect(() => {
//     if (!address) return;
//     (async () => {
//       try {
//         const res = await fetch(`/api/check-user?address=${address}`);
//         const data = await res.json();
//         if (res.ok && data.registered) {
//           sessionStorage.setItem("walletAddress", address);
//           router.push(`/dashboard/${data.role}`);
//         } else {
//           setIsRegistered(false);
//         }
//       } catch (err) {
//         toast.error("Failed to check registration");
//       }
//     })();
//   }, [address]);

//   const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSignAndSubmit = async () => {
//     if (!address) return toast.error("Connect wallet first");
//     if (!form.name || !form.email || !form.role) return toast.error("Fill all fields");

//     const sig = await signMessage(message);
//     if (!sig) return toast.error("Signing failed");

//     const res = await fetch("/api/auth", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         address,
//         signature: sig,
//         message,
//         name: form.name,
//         email: form.email,
//         role: form.role,
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       toast.success("Registered & Logged in!");
//       sessionStorage.setItem("walletAddress", address);
//       router.push(`/dashboard/${form.role}`);
//     } else {
//       toast.error(data.error || "Unknown error");
//     }
//   };

//   return (
//     <main className="p-8 max-w-md mx-auto">
//       {!address ? (
//         <button onClick={connectWallet} className="btn">Connect MetaMask</button>
//       ) : isRegistered === false ? (
//         <>
//           <p>Connected wallet: {address}</p>

//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleInput}
//             className="input"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleInput}
//             className="input"
//           />

//           <select name="role" value={form.role} onChange={handleInput} className="input">
//             <option value="">Select Role</option>
//             <option value="patient">Patient</option>
//             <option value="doctor">Doctor</option>
//             <option value="donor">Donor</option>
//             <option value="admin">Admin</option>
//           </select>

//           <button onClick={handleSignAndSubmit} className="btn mt-4">
//             Sign & Submit
//           </button>
//         </>
//       ) : (
//         <p className="text-center">Checking registration...</p>
//       )}
//     </main>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useWallet from "@/hooks/useWallet";
import Head from "next/head";

export default function Page() {
  const { address, connectWallet, signMessage } = useWallet();
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [message] = useState("Login to CareChain");
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const router = useRouter();

  // Check if user is already registered
  useEffect(() => {
    if (!address) return;
    (async () => {
      try {
        const res = await fetch(`/api/check-user?address=${address}`);
        const data = await res.json();
        if (res.ok && data.registered) {
          sessionStorage.setItem("walletAddress", address);
          router.push(`/dashboard/${data.role}`);
        } else {
          setIsRegistered(false);
        }
      } catch (err) {
        toast.error("Failed to check registration");
      }
    })();
  }, [address]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignAndSubmit = async () => {
    if (!address) return toast.error("Connect wallet first");
    if (!form.name || !form.email || !form.role) return toast.error("Fill all fields");

    const sig = await signMessage(message);
    if (!sig) return toast.error("Signing failed");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        signature: sig,
        message,
        name: form.name,
        email: form.email,
        role: form.role,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Registered & Logged in!");
      sessionStorage.setItem("walletAddress", address);
      router.push(`/dashboard/${form.role}`);
    } else {
      toast.error(data.error || "Unknown error");
    }
  };

  return (
    <>
      <Head>
        <title>CareChain - Decentralized Healthcare Platform</title>
        <meta name="description" content="Secure, transparent healthcare records on the blockchain" />
      </Head>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-2xl font-bold text-blue-600">CareChain</span>
        </div>
        
        {!address ? (
          <button 
            onClick={connectWallet} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Connect MetaMask
          </button>
        ) : (
          <div className="text-sm bg-blue-100 text-blue-800 py-2 px-3 rounded-full">
            {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
          </div>
        )}
      </nav>

      <main className="min-h-screen bg-gray-50">
        {!address ? (
          /* Hero Section for non-connected users */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Revolutionizing <span className="text-blue-600">Healthcare</span> with Blockchain
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                Secure, transparent, and decentralized medical records management for patients, doctors, and healthcare providers.
              </p>
              <button 
                onClick={connectWallet} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 text-lg"
              >
                Connect Wallet to Get Started
              </button>
            </div>

            {/* Features Section */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Records</h3>
                <p className="text-gray-600">Your medical data is encrypted and stored securely on the blockchain.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
                <p className="text-gray-600">Authorized healthcare providers can access your records when needed.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Data Ownership</h3>
                <p className="text-gray-600">You control who can view and modify your medical information.</p>
              </div>
            </div>
          </div>
        ) : isRegistered === false ? (
          /* Registration Form */
          <div className="max-w-md mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Complete Your Registration</h2>
                <p className="text-gray-600 mt-2">Connected wallet: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{address}</span></p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                  <select 
                    id="role"
                    name="role" 
                    value={form.role} 
                    onChange={handleInput} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  >
                    <option value="">Select your role</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="donor">Organ Donor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <button 
                  onClick={handleSignAndSubmit} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                >
                  Sign & Complete Registration
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Loading State */
          <div className="max-w-md mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking your registration status...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-2xl font-bold text-white">CareChain</span>
              </div>
              <p className="text-gray-400">Secure, transparent healthcare records on the blockchain.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="text-gray-400 not-italic">
                <p>123 Healthcare St</p>
                <p>San Francisco, CA 94107</p>
                <p className="mt-2">info@carechain.com</p>
                <p>+1 (555) 123-4567</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CareChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}