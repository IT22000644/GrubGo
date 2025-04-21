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
  return (
    <div className="p-6 bg-blue-50 rounded-3xl shadow-lg border-double border-4 border-blue-800 max-w-xl w-full">
      <h3 className="text-lg font-semibold text-blue-600 mb-4">
        Next Location: {role}
      </h3>

      <div className="flex items-center gap-5">
        {/* Avatar */}
        <img
          src={imageUrl}
          alt={fullName}
          className="w-20 h-20 rounded-2xl object-cover border-4 border-blue-500 shadow"
        />

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-xl font-semibold text-orange-600">
            {fullName}
          </span>
          <p className="text-sm text-gray-700 mt-1 max-w-xs">{address}</p>
        </div>
      </div>
    </div>
  );
};

export default NextLocationCard;
