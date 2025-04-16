// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import { User } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700 dark:text-white">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral dark:bg-dark flex justify-center items-center px-4 py-10">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

        {user.photoURL && (
          <div className="flex justify-center mb-4">
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-primary"
            />
          </div>
        )}

        <div className="mb-2">
          <strong>Name:</strong> {user.displayName || "Not available"}
        </div>

        <div className="mb-2">
          <strong>Email:</strong> {user.email}
        </div>

        <div className="mt-6 text-center">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => auth.signOut()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
