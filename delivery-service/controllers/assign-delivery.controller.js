import Delivery from "../models/Delivery.js";
import { getDirections } from "../services/google-maps.service.js";
import {
  calculateEstimatedTimeFromRoute,
  calculateExpectedDeliveryTime,
  calculateHaversineDistance,
} from "../utils/time-calculator.util.js";

const AssignDeliveryController = {
  async findClosestDriver(req, res) {
    try {
      const { drivers, restaurantLocation } = req.body;

      if (!drivers || !restaurantLocation) {
        return res.status(400).json({
          message: "Missing required data: drivers or restaurant location",
        });
      }

      let closestDriver = null;
      let minDistance = Number.POSITIVE_INFINITY;

      drivers.forEach((driver) => {
        const distance = calculateHaversineDistance(
          driver.latitude,
          driver.longitude,
          restaurantLocation.latitude,
          restaurantLocation.longitude
        );
        console.log(
          `Driver ${driver.driverId} - Distance to restaurant: ${distance.toFixed(2)} km`
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestDriver = driver;
        }
      });

      if (!closestDriver) {
        return res.status(404).json({ message: "No drivers found" });
      }

      console.log(
        `Closest driver is ${closestDriver.driverId} at a distance of ${minDistance.toFixed(2)} km`
      );
      res.status(200).json({
        message: "Closest driver found",
        driver: closestDriver,
        distance: minDistance,
      });
    } catch (error) {
      console.error("Error finding closest driver:", error);
      res.status(500).json({ message: "Error finding closest driver", error });
    }
  },

  async assignDelivery(req, res) {
    try {
      const {
        orderId,
        driverId,
        driverLocation,
        customerLocation,
        restaurantLocation,
      } = req.body;

      if (
        !driverLocation ||
        !customerLocation ||
        !restaurantLocation ||
        !driverId
      ) {
        return res.status(400).json({ message: "Missing required data" });
      }

      //Get directions from the driver to the restaurant

      const directionsToRestaurant = await getDirections(
        `${driverLocation.latitude},${driverLocation.longitude}`,
        `${restaurantLocation.latitude},${restaurantLocation.longitude}`
      );

      //Get directions from the restaurant to the customer

      const directionsToCustomer = await getDirections(
        `${restaurantLocation.latitude},${restaurantLocation.longitude}`,
        `${customerLocation.latitude},${customerLocation.longitude}`
      );

      const estimatedTimeToRestaurant = calculateEstimatedTimeFromRoute(
        directionsToRestaurant.data.routes[0]
      );
      const estimatedTimeToCustomer = calculateEstimatedTimeFromRoute(
        directionsToCustomer.data.routes[0]
      );

      console.log(
        `Order ${orderId} - Estimated time to Restaurant: ${estimatedTimeToRestaurant} minutes`
      );
      console.log(
        `Order ${orderId} - Estimated time to Customer: ${estimatedTimeToCustomer} minutes`
      );

      const totalEstimatedTime =
        estimatedTimeToRestaurant + estimatedTimeToCustomer;
      const expectedDeliveryTime =
        calculateExpectedDeliveryTime(totalEstimatedTime);

      // Create and save the delivery
      const delivery = new Delivery({
        orderId,
        driverId,
        customerLocation,
        restaurantLocation,
        estimatedTimeToRestaurant,
        estimatedTimeToCustomer,
        estimatedDeliveryTime: totalEstimatedTime,
        expectedDeliveryTime: expectedDeliveryTime,
        status: "Assigned",
      });

      await delivery.save();

      console.log(
        `Order ${orderId} assigned. Expected delivery time: ${expectedDeliveryTime.toLocaleTimeString()}`
      );

      res.status(201).json({
        message: "Delivery assigned successfully",
        delivery,
        totalEstimatedTime,
        expectedDeliveryTime: expectedDeliveryTime.toLocaleTimeString(),
      });

      // After 10 seconds, update status to "In Transit"
      setTimeout(async () => {
        delivery.status = "In Transit";
        await delivery.save();
        console.log(`Order ${orderId} - Status updated to 'In Transit'`);

        // After the estimatedTimeToRestaurant elapses, update status to "Arrived Restaurant"
        setTimeout(async () => {
          delivery.status = "Arrived Restaurant";
          await delivery.save();
          console.log(
            `Order ${orderId} - Status updated to 'Arrived Restaurant'`
          );
        }, estimatedTimeToRestaurant * 60000);
      }, 10000); // 10 seconds delay
    } catch (error) {
      console.error("Error in assignDelivery:", error);
      res.status(500).json({ message: "Error assigning delivery", error });
    }
  },
};

export default AssignDeliveryController;
