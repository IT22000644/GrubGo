import Delivery from '../models/Delivery.models.js';
import Driver from '../models/Driver.models.js';
import Restaurant from '../models/Resturant.models.js';
import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';
dotenv.config();

const googleMapsClient = new Client({});

// Find the closest driver and assign delivery
export const assignDelivery = async (req, res) => {
  try {
    const { orderId, restaurantId, customerLocation } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant)
      return res.status(404).json({ message: 'Restaurant not found' });

    const drivers = await Driver.find();
    if (drivers.length === 0)
      return res.status(404).json({ message: 'No available drivers' });

    const driver = drivers[0]; // Selecting the first driver for testing purposes

    const delivery = new Delivery({
      orderId,
      restaurantId,
      driverId: driver._id,
      customerLocation,
      status: 'Picked Up',
    });

    await delivery.save();
    res.status(201).json({ message: 'Delivery assigned', delivery });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning delivery', error });
  }
};

// Simulate delivery movement
export const simulateDeliveryMovement = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery)
      return res.status(404).json({ message: 'Delivery not found' });

    let statusUpdates = ['Picked Up', 'In Transit', 'Delivered'];
    let index = 0;

    const interval = setInterval(async () => {
      if (index >= statusUpdates.length) {
        clearInterval(interval);
        return;
      }

      delivery.status = statusUpdates[index++];
      await delivery.save();
      console.log(`Delivery ${deliveryId} updated to ${delivery.status}`);
    }, 5000); // Update every 5 seconds

    res.json({ message: 'Simulating delivery', deliveryId });
  } catch (error) {
    res.status(500).json({ message: 'Error in delivery simulation', error });
  }
};

export const getRoute = async (req, res) => {
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
};
