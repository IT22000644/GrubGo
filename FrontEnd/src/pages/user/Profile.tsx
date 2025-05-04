import { useState } from "react";
import { Camera, Save, X, Edit, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Profile update data:", formData);

    setIsEditing(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <div className=" text-black dark:text-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isEditing ? "Edit Profile" : "My Profile"}
          </h2>
          {!isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                setFormData({
                  username: user?.username || "",
                  email: user?.email || "",
                  phone: user?.phoneNumber || "",
                });
              }}
              className="flex items-center gap-2 text-primary hover:text-primary/70 dark:text-white text-sm font-medium"
            >
              <Edit size={16} />
              Edit
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>

        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <img
              src={user?.profilePicture || "/api/placeholder/100/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md object-cover"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md">
                <Camera size={16} />
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              />
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/70 dark:bg-dark dark:hover:dark/70 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors"
              >
                <Save size={16} className="text-white" />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Username
                </span>
                <p className="font-medium text-gray-800 dark:text-white">
                  {user?.username || "Not available"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </span>
                <p className="font-medium text-gray-800 dark:text-white">
                  {user?.email || "Not available"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phone
                </span>
                <p className="font-medium text-gray-800 dark:text-white">
                  {user?.phoneNumber || "Not available"}
                </p>
              </div>
              {user && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bio
                  </span>
                  <p className="font-medium text-gray-800 dark:text-white">
                    I'm a software developer passionate about React and modern
                    UI design.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Role</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {user?.role || "Not available"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Verification Status
                </span>
                <span
                  className={`font-medium ${
                    user?.isVerified ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {user?.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Account Created
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {user?.createdAt
                    ? new Date(user?.createdAt).toLocaleDateString()
                    : "Not available"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "Not available"}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="mt-8">
          <button
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
