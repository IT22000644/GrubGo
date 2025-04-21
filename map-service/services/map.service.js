import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const getCoordinates = async (address) => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
  const response = await axios.get(url);
  const data = response.data;

  if (data.status !== "OK" || !data.results.length) {
    throw new Error(data.error_message || data.status || "Geocoding failed");
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { latitude: lat, longitude: lng };
};

const getAddressFromCoordinates = async (latitude, longitude) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  const response = await axios.get(url);
  const data = response.data;

  if (data.status !== "OK" || !data.results.length) {
    throw new Error(
      data.error_message || data.status || "Reverse geocoding failed"
    );
  }

  return data.results[0].formatted_address;
};

const formatAddressParts = (parts) => {
  const {
    street = "",
    city = "",
    province = "",
    state = "",
    zip = "",
    country = "",
  } = parts;

  return [street, city, province || state, zip, country]
    .filter(Boolean)
    .join(", ");
};

const MapService = {
  getCoordinates,
  getAddressFromCoordinates,
  formatAddressParts,
};

export default MapService;
