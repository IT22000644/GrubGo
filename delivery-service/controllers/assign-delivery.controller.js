import Delivery from "../models/Delivery.js";
import { getDirections } from "../services/google-maps.service.js";
import {
  calculateEstimatedTimeFromRoute,
  calculateExpectedDeliveryTime,
} from "../utils/time-calculator.util.js";

const TEN_SECONDS = 10 * 1000;
const ONE_SECOND = 1 * 1000;

const AssignDeliveryController = {
  //Delivery Assigning Function
  async assignDelivery(req, res) {
    try {
      const now = new Date();

      const {
        orderId,
        driverId,
        driverAddress,
        restaurantAddress,
        customerAddress,
        driverLocation,
        restaurantLocation,
        customerLocation,
      } = req.body;

      if (
        !orderId ||
        !driverId ||
        !driverAddress ||
        !restaurantAddress ||
        !customerAddress ||
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

      const etaRestSeconds = calculateEstimatedTimeFromRoute(
        dirToRest.data.routes[0]
      );
      const etaCustSeconds = calculateEstimatedTimeFromRoute(
        dirToCust.data.routes[0]
      );

      // Calculate minutes and seconds for ETA to Restaurant and Customer
      const etaRestMinutes = Math.floor(etaRestSeconds / 60);
      const etaRestSecondsRemaining = etaRestSeconds % 60;

      const etaCustMinutes = Math.floor(etaCustSeconds / 60);
      const etaCustSecondsRemaining = etaCustSeconds % 60;

      console.log(
        `Order ${orderId} - ETA to Restaurant: ${etaRestMinutes}m ${etaRestSecondsRemaining}s`
      );
      console.log(
        `Order ${orderId} - ETA to Customer:  ${etaCustMinutes}m ${etaCustSecondsRemaining}s`
      );

      // Compute scheduled timestamps
      const assignedAt = now;
      const inTransitAt = new Date(now.getTime() + TEN_SECONDS);
      const arrivedRestaurantAt = new Date(
        inTransitAt.getTime() + etaRestSeconds * ONE_SECOND
      );

      const totalEtaSeconds = etaRestSeconds + etaCustSeconds;
      const expectedDeliveryTime = calculateExpectedDeliveryTime(
        totalEtaSeconds / 60
      );

      const existingDelivery = await Delivery.findOne({ orderId });
      if (existingDelivery) {
        return res.status(409).json({
          message: `A delivery already exists for order ID: ${orderId}`,
        });
      }

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

        driverAddress,
        restaurantAddress,
        customerAddress,

        estimatedTimeToRestaurant: etaRestSeconds,
        estimatedTimeToCustomer: etaCustSeconds,
        expectedDeliveryTime,

        status: "Assigned",
      });

      console.log(`Order ${orderId} Assigned`);

      const io = req.app.get("io");
      io.emit(`delivery:${orderId}`, {
        status: "Assigned",
        timestamp: now,
      });

      res.status(201).json({ message: "Delivery assigned", delivery });
    } catch (err) {
      console.error("Error in assignDelivery:", err);
      res.status(500).json({ message: "Error assigning delivery", err });
    }
  },
};

export default AssignDeliveryController;
