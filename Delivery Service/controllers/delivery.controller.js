import Delivery from '../models/Delivery.models.js';
import Driver from '../models/Driver.models.js';
import Restaurant from '../models/Resturant.models.js';
import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';
dotenv.config();

const googleMapsClient = new Client({});

// Haversine formula to calculate the distance between two points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert to radians

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Calculate the estimated delivery time (in minutes)
const calculateEstimatedTime = distanceInKm => {
  const averageSpeed = 40; // Average speed in km/h
  const timeInHours = distanceInKm / averageSpeed;
  const timeInMinutes = timeInHours * 60;
  const timeInSeconds = timeInMinutes * 60;
  return Math.round(timeInSeconds); // return rounded time in minutes
};

const deliveryController = {
  // Find the closest driver and assign delivery
  async assignDelivery(req, res) {
    try {
      const { orderId, restaurantId, customerLocation } = req.body;

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant)
        return res.status(404).json({ message: 'Restaurant not found' });

      const drivers = await Driver.find({ isAvailable: true });
      if (drivers.length === 0)
        return res.status(404).json({ message: 'No available drivers' });

      let closestDriver = null;
      let minDistance = Infinity;

      // Find the closest driver using the Haversine formula
      drivers.forEach(driver => {
        const distance = getDistance(
          restaurant.location.lat,
          restaurant.location.lng,
          driver.location.lat,
          driver.location.lng
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestDriver = driver;
        }
      });

      if (!closestDriver)
        return res.status(404).json({ message: 'No suitable driver found' });

      // Step 1: Estimate time from driver to restaurant
      const distanceToRestaurant = getDistance(
        closestDriver.location.lat,
        closestDriver.location.lng,
        restaurant.location.lat,
        restaurant.location.lng
      );
      const estimatedTimeToRestaurant =
        calculateEstimatedTime(distanceToRestaurant);

      // Step 2: Estimate time from restaurant to customer
      const distanceToCustomer = getDistance(
        restaurant.location.lat,
        restaurant.location.lng,
        customerLocation.latitude,
        customerLocation.longitude
      );
      const estimatedTimeToCustomer =
        calculateEstimatedTime(distanceToCustomer);

      // Total estimated time (sum of both segments)
      const totalEstimatedTime =
        estimatedTimeToRestaurant + estimatedTimeToCustomer;

      console.log(
        `Estimated time to restaurant: ${estimatedTimeToRestaurant} seconds`
      );
      console.log(
        `Estimated time to customer from restaurant: ${estimatedTimeToCustomer} seconds`
      );
      console.log(
        `Total estimated delivery time: ${totalEstimatedTime} seconds`
      );

      const delivery = new Delivery({
        orderId,
        restaurantId,
        driverId: closestDriver._id,
        customerLocation,
        status: 'Assigned',
      });

      await delivery.save();

      // Simulate delivery movement
      let index = 0;
      let timeElapsed = 0; // Tracks the elapsed time for simulation

      const totalTimeForRestaurant = estimatedTimeToRestaurant; // Time to restaurant
      const totalTimeToCustomer = estimatedTimeToCustomer; // Time from restaurant to customer

      // Function to simulate the movement
      const simulateMovement = setInterval(async () => {
        timeElapsed += 5; // Increment by 5 seconds for each interval

        if (index === 0 && timeElapsed <= totalTimeForRestaurant) {
          // Driver is on the way to the restaurant
          console.log(`Driver is on the way to the restaurant...`);
          await Delivery.findByIdAndUpdate(delivery._id, {
            status: 'In Transit',
          });
        } else if (index === 0 && timeElapsed > totalTimeForRestaurant) {
          // Reached the restaurant
          console.log('Driver has picked up the order.');
          await Delivery.findByIdAndUpdate(delivery._id, {
            status: 'Picked Up',
          });
          index++;
        } else if (
          index === 1 &&
          timeElapsed <= totalTimeToCustomer + totalTimeForRestaurant
        ) {
          // Simulate driver moving to the customer
          if (timeElapsed === totalTimeForRestaurant + 5) {
            console.log('Driver is on the way to the customer...');
            await Delivery.findByIdAndUpdate(delivery._id, {
              status: 'In Transit',
            });
          }
        } else if (
          index === 1 &&
          timeElapsed > totalTimeToCustomer + totalTimeForRestaurant
        ) {
          // Delivery completed
          console.log('Delivery has been completed.');
          await Delivery.findByIdAndUpdate(delivery._id, {
            status: 'Delivered',
          });
          clearInterval(simulateMovement); // Stop the simulation
        }
      }, 5000); // Update every 5 seconds to simulate movement

      res.status(201).json({
        message: 'Delivery assigned and simulation started',
        delivery,
        totalEstimatedTime,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning delivery', error });
    }
  },

  // Get route between origin and destination using Google Maps API
  async getRoute(req, res) {
    try {
      const { origin, destination } = req.body;

      const response = await googleMapsClient.directions({
        params: {
          origin,
          destination,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching route', error });
    }
  },

  // Get route between origin and destination using Google Maps API
  async getRoute(req, res) {
    try {
      const { origin, destination } = req.body;

      const response = await googleMapsClient.directions({
        params: {
          origin,
          destination,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching route', error });
    }
  },
};

export default deliveryController;
