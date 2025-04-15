import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from "dotenv";
dotenv.config();

const googleMapsClient = new Client({});

export const getDirections = async (origin, destination) => {
  return googleMapsClient.directions({
    params: {
      origin: origin,
      destination: destination,
      mode: "driving",
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });
};

export default googleMapsClient;
