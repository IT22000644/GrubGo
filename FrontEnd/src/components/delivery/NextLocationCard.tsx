import React from "react";

interface NextLocationCardProps {
  imageUrl: string;
  fullName: string;
  address: string;
  role: "Customer" | "Restaurant";
}

const NextLocationCard: React.FC<NextLocationCardProps> = ({
  imageUrl,
  fullName,
  address,
  role,
}) => {
  const isDefaultImage =
    !imageUrl || imageUrl === "https://example.com/default-profile-picture.png";

  const displayImage = isDefaultImage
    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCw6RV343VjEiadcJNk0mbq_2dzMeizoL96g&s"
    : imageUrl;

  return (
    <div className="p-6 bg-neutral dark:bg-accent/30 rounded-2xl shadow-lg max-w-xl w-full">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Next Location: {role}
      </h3>

      <div className="flex items-center gap-5">
        {/* Avatar */}
        <img
          src={displayImage}
          alt={fullName}
          className="w-20 h-20 rounded-2xl object-cover border-4 border-primary shadow-lg"
        />

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-xl font-semibold text-primary">{fullName}</span>
          <p className="text-sm font-semibold text-gray-700 dark:text-white mt-1 max-w-xs">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NextLocationCard;
