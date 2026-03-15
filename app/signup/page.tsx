"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Facebook.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white pb-24 md:pb-6 relative w-full h-full">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--green-light)] rounded-bl-full opacity-50 z-0"></div>
      <div className="absolute top-20 left-0 w-16 h-16 bg-[var(--green-light)] rounded-tr-full opacity-50 z-0"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-[var(--green-light)] rounded-tl-full opacity-50 z-0"></div>

      <div className="w-full max-w-[400px] z-10 flex flex-col neo-card bg-white p-6 md:p-8 my-auto h-auto !bg-[var(--green-light)]">

        {/* Logo */}
        <div className="flex justify-center mb-8 gap-2 items-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold bg-[var(--green-primary)] text-white" style={{ border: '2.5px solid #1a1a1a', boxShadow: '2px 2px 0 #1a1a1a' }}>
            🍽️
          </div>
          <h1 className="text-3xl font-extrabold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Poly<span className="text-[var(--green-primary)]">Toon</span>Food
          </h1>
        </div>

        {error && (
          <div className="w-full p-3 mb-4 bg-red-100 text-red-700 font-bold text-sm rounded-lg" style={{ border: "2px solid #e63946" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="w-full space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="neo-input h-14 font-bold"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neo-input h-14 font-bold"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neo-input h-14 font-bold pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-0 bottom-0 m-auto text-xl opacity-60"
            >
              👁️
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="neo-input h-14 font-bold pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-0 bottom-0 m-auto text-xl opacity-60"
            >
              👁️
            </button>
          </div>

          <button
            type="submit"
            className="neo-btn neo-btn-primary w-full h-14 text-lg font-extrabold mt-6"
            style={{ boxShadow: "4px 4px 0 #1a1a1a" }}
          >
            SIGN UP
          </button>
        </form>

        <div className="w-full my-6 flex items-center justify-center gap-4 text-gray-500 font-bold text-sm">
          <div className="flex-1 h-0.5 bg-gray-200"></div>
          <span>Or sign up with</span>
          <div className="flex-1 h-0.5 bg-gray-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button type="button" onClick={handleGoogleLogin} className="neo-btn bg-white w-full h-12 gap-2 text-sm text-gray-700 hover:text-black">
            <span className="font-extrabold text-lg text-black">G</span> Google
          </button>
          <button type="button" onClick={handleFacebookLogin} className="neo-btn bg-white w-full h-12 gap-2 text-sm text-gray-700 hover:text-black">
            <span className="font-extrabold text-lg" style={{ color: "#1877F2" }}>f</span> Facebook
          </button>
        </div>

        <p className="mt-8 text-center font-bold text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--green-primary)] hover:underline">
            LOGIN
          </Link>
        </p>
      </div>
    </main>
  );
}
