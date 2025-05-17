"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useWallet from "@/hooks/useWallet";

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
    <main className="p-8 max-w-md mx-auto">
      {!address ? (
        <button onClick={connectWallet} className="btn">Connect MetaMask</button>
      ) : isRegistered === false ? (
        <>
          <p>Connected wallet: {address}</p>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInput}
            className="input"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInput}
            className="input"
          />

          <select name="role" value={form.role} onChange={handleInput} className="input">
            <option value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="donor">Donor</option>
            <option value="admin">Admin</option>
          </select>

          <button onClick={handleSignAndSubmit} className="btn mt-4">
            Sign & Submit
          </button>
        </>
      ) : (
        <p className="text-center">Checking registration...</p>
      )}
    </main>
  );
}
