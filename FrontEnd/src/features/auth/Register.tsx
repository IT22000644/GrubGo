import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/config";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError("");
      alert("Registration successful!");
      // You can navigate to login or dashboard here
    } catch (err: any) {
      setError(err.message);
    }
  };

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
    <div className="min-h-screen flex justify-center items-center bg-neutral dark:bg-dark">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

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
          Register
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full font-bold bg-neutral text-dark hover:bg-primary hover:text-neutral text-white py-2 rounded shadow-md border-1"
        >
          Sign in with Google
        </button>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:text-black">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
