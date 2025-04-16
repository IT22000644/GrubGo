// src/pages/Login.tsx
import { useState } from "react";
import { auth, googleProvider } from "../../firebase/config";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google login success:", user);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral dark:bg-dark">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded text-black"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded text-black"
          required
        />

        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full font-bold bg-neutral text-dark hover:bg-primary hover:text-neutral text-white py-2 rounded shadow-md border-1 mb-4"
        >
          login
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full font-bold bg-neutral text-dark hover:bg-primary hover:text-neutral text-white py-2 rounded shadow-md border-1"
        >
          Sign in with Google
        </button>
        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:text-black">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
