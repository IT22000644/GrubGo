import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const [isAnimating, setIsAnimating] = useState(false);

  // Apply dark or light mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setIsDark(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleToggle = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsDark(!isDark);
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }, 150);
    }
  };

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={handleToggle}
      className={`relative w-12 h-6 rounded-full p-1 mx-4  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-orange-500 focus:ring-opacity-50 ${
        isDark ? "bg-dark" : "bg-orange-100"
      }`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-300 to-yellow-300 dark:from-indigo-900 dark:to-purple-900 opacity-50 transition-opacity duration-300" />

      <div
        className={`flex items-center justify-center w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          isAnimating ? "scale-90" : "scale-100"
        } ${
          isDark ? "translate-x-6 bg-indigo-800" : "translate-x-0 bg-primary"
        }`}
      >
        {isDark ? (
          <Moon size={10} className="text-white" />
        ) : (
          <Sun size={10} className="text-white" />
        )}
      </div>

      <span
        className={`absolute left-0 ml-7 text-xs font-medium transition-opacity duration-300 ${
          isDark ? "opacity-0" : "opacity-100 text-gray-700"
        }`}
      ></span>

      <span
        className={`absolute left-0 ml-1 text-xs font-medium transition-opacity duration-300 ${
          isDark ? "opacity-100 text-gray-300" : "opacity-0"
        }`}
      ></span>

      <div
        className={`absolute inset-0 rounded-full ring-4 ring-orange-300 dark:ring-indigo-700 transition-all duration-300 ${
          isAnimating ? "ring-opacity-50 scale-105" : "ring-opacity-0 scale-100"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
