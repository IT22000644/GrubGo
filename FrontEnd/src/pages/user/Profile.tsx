// src/pages/Profile.tsx
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const token = useSelector((state: RootState) => state.auth.token);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((u) => {
  //     setUser(u);
  //   });

  //   return () => unsubscribe();
  // }, []);

  const handleLogout = () => {
    try {
      if (token) {
        dispatch({ type: "auth/logout" });
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isAuthenticated) {
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

        {user?.profilePicture && (
          <div className="flex justify-center mb-4">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-primary"
            />
          </div>
        )}

        <div className="mb-2">
          <strong>Name:</strong> {user?.username || "Not available"}
        </div>

        <div className="mb-2">
          <strong>Email:</strong> {user?.email}
        </div>

        <div className="mt-6 text-center">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
