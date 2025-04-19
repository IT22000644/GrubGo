import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Food } from "../allRestaurants/AllRestaurants.types";
import api from "../../../api/axios";
import { Loader } from "../../common/loader";

const FoodDetailsPage = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoodDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/foods/${id}`);
      setFood(response.data.restaurant);
      console.log(response);
    } catch (error) {
      console.error("Failed to fetch food details:", error);
      setError("Failed to fetch food details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Invalid parameters");
      setLoading(false);
      return;
    }

    fetchFoodDetails();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error || !food) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error || "Something went wrong"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const actualPrice =
    food.discount > 0
      ? food.price - (food.price * food.discount) / 100
      : food.price;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {food.images && food.images.length > 0 ? (
          <div className="relative h-64 bg-gray-200">
            <img
              src={food.images[0]}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            {food.discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded">
                {food.discount}% OFF
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-800">{food.name}</h1>
            <div>
              {food.discount > 0 ? (
                <div className="text-right">
                  <span className="text-xl font-bold text-green-600">
                    ${actualPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-gray-500 line-through">
                    ${food.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-green-600">
                  ${food.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {food.category.name}
            </span>
          </div>

          <p className="mt-4 text-gray-600">{food.description}</p>

          <div className="mt-6 flex gap-2">
            <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Add to Cart
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              ♥ Favorite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsPage;
