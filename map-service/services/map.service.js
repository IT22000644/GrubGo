import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const getCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Google Maps API key is not set in the environment variables."
    );
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  const response = await axios.get(url);
  const data = response.data;

  if (data.status !== "OK" || !data.results.length) {
    throw new Error(data.error_message || data.status || "Map failed");
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { latitude: lat, longitude: lng };
};

export default { getCoordinates };
