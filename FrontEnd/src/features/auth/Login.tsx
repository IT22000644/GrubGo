// src/pages/Login.tsx
import { useState } from "react";
import { auth, googleProvider } from "../../firebase/config";
import { signInWithPopup } from "firebase/auth";
import Google from "../../assets/Images/OIP (3).jpeg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser } from "./authSlice";

interface LoginProps {
  switchToRegister: () => void;
  setShowAuthModal: (show: boolean) => void;
  setIsSuccess: (success: boolean) => void;
}

export const Login = ({
  switchToRegister,
  setShowAuthModal,
  setIsSuccess,
}: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google login success:", user);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      setShowAuthModal(false);
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Login error:", error);
      setError("Login failed");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {error && (
        <p className="w-full bg-accent/20 text-accent/80 text-center mb-2 text-sm font-bold rounded p-2 mb-4">
          {error}
        </p>
      )}

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

      <button
        onClick={handleLogin}
        className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1 mb-4"
      >
        login
      </button>

      <button
        onClick={handleGoogleLogin}
        className="w-full font-bold text-sm bg-neutral text-text_dark hover:shadow-lg hover:text-primary text-dark py-2 rounded shadow-md border-1"
      >
        <img src={Google} alt="Google logo" className="inline-block h-5 mr-2" />
        Sign in with Google
      </button>
      <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <button
          onClick={switchToRegister}
          className="text-primary hover:text-black underline"
        >
          Register
        </button>
      </p>
    </div>
  );
};
