"use client";

import { useState } from "react";
import useWallet from "@/hooks/useWallet";

export default function Page() {
  const { address, connectWallet, signMessage } = useWallet();

  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [signature, setSignature] = useState<string | null>(null);
  const [message] = useState("Login to CareChain");
  const [status, setStatus] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignAndSubmit = async () => {
    if (!address) return alert("Connect wallet first");
    if (!form.name || !form.email || !form.role) return alert("Fill all fields");

    const sig = await signMessage(message);
    if (!sig) return alert("Signing failed");
    setSignature(sig);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        address, 
        signature: sig, 
        message, 
        name: form.name, 
        email: form.email, 
        role: form.role 
      }),
    });

    const data = await res.json();
    if (res.ok) setStatus("Login successful!");
    else setStatus(`Error: ${data.error || "Unknown error"}`);
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      {!address ? (
        <button onClick={connectWallet} className="btn">Connect MetaMask</button>
      ) : (
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

          {signature && (
            <p className="mt-2 break-all text-sm">Signature: {signature}</p>
          )}

          {status && <p className="mt-4">{status}</p>}
        </>
      )}
    </main>
  );
}
