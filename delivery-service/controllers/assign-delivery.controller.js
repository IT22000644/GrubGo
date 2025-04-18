import Delivery from "../models/Delivery.js";
import { getDirections } from "../services/google-maps.service.js";
import {
  calculateEstimatedTimeFromRoute,
  calculateExpectedDeliveryTime,
  calculateHaversineDistance,
} from "../utils/time-calculator.util.js";

const TEN_SECONDS = 10 * 1000;
const MS_PER_MINUTE = 60 * 1000;

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
      const now = new Date();

      const {
        orderId,
        driverId,
        driverLocation,
        restaurantLocation,
        customerLocation,
      } = req.body;

      if (
        !orderId ||
        !driverId ||
        !driverLocation ||
        !restaurantLocation ||
        !customerLocation
      ) {
        return res.status(400).json({ message: "Missing required data" });
      }

      // Fetching Estimated Times
      const dirToRest = await getDirections(
        `${driverLocation.latitude},${driverLocation.longitude}`,
        `${restaurantLocation.latitude},${restaurantLocation.longitude}`
      );
      const dirToCust = await getDirections(
        `${restaurantLocation.latitude},${restaurantLocation.longitude}`,
        `${customerLocation.latitude},${customerLocation.longitude}`
      );

      const etaRest = calculateEstimatedTimeFromRoute(dirToRest.data.routes[0]);
      const etaCust = calculateEstimatedTimeFromRoute(dirToCust.data.routes[0]);

      console.log(`Order ${orderId} - ETA to Restaurant: ${etaRest} min`);
      console.log(`Order ${orderId} - ETA to Customer:  ${etaCust} min`);

      // compute scheduled timestamps
      const assignedAt = now;
      const inTransitAt = new Date(now.getTime() + TEN_SECONDS);
      const arrivedRestaurantAt = new Date(
        inTransitAt.getTime() + etaRest * MS_PER_MINUTE
      );

      const totalEta = etaRest + etaCust;
      const expectedDeliveryTime = calculateExpectedDeliveryTime(totalEta);

      const delivery = await Delivery.create({
        orderId,
        driverId,
        driverLocation,
        restaurantLocation,
        customerLocation,

        // scheduling fields for cron
        assignedAt,
        inTransitAt,
        arrivedRestaurantAt,

        estimatedTimeToRestaurant: etaRest,
        estimatedTimeToCustomer: etaCust,
        expectedDeliveryTime,

        status: "Assigned",
      });

      console.log(
        `Order ${orderId} assigned @ ${assignedAt.toISOString()}. Expected delivery at ${expectedDeliveryTime.toISOString()}`
      );

      res.status(201).json({ message: "Delivery assigned", delivery });
    } catch (err) {
      console.error("Error in assignDelivery:", err);
      res.status(500).json({ message: "Error assigning delivery", err });
    }
  },
};

export default AssignDeliveryController;
