import Delivery from "../models/Delivery.js";
import { calculateHaversineDistance } from "../utils/time-calculator.util.js";

const TEN_SECONDS = 10 * 1000;
const MS_PER_MINUTE = 60 * 1000;

const DeliveryStatusController = {
  // Method to update the status to "Picked Up".

  async updateStatusToPickedUp(req, res) {
    try {
      const { deliveryId } = req.body;
      const d = await Delivery.findById(deliveryId);
      if (!d || d.status !== "Arrived Restaurant") {
        return res.status(400).json({ message: "Cannot pick up yet" });
      }

      const now = new Date();
      d.pickedUpAt = now;
      d.inTransitPickedUpAt = new Date(now.getTime() + TEN_SECONDS);
      d.arrivedCustomerAt = new Date(
        d.inTransitPickedUpAt.getTime() +
          d.estimatedTimeToCustomer * MS_PER_MINUTE
      );

      d.expectedDeliveryTime = new Date(
        d.inTransitPickedUpAt.getTime() +
          d.estimatedTimeToCustomer * MS_PER_MINUTE
      );

      d.status = "Picked Up";
      await d.save();

      console.log(
        `Order ${d.orderId} - Status updated to 'Picked Up' @ ${now.toISOString()}`
      );
      return res.json({ message: "Picked Up", delivery: d });
    } catch (err) {
      console.error("Error in updateStatusToPickedUp:", err);
      res.status(500).json({ message: "Error picking up", err });
    }
  },

  async updateStatusToDelivered(req, res) {
    try {
      const { deliveryId } = req.body;
      const d = await Delivery.findById(deliveryId);
      if (!d || d.status !== "Arrived Customer") {
        return res.status(400).json({ message: "Cannot deliver yet" });
      }

      const now = new Date(); // UTC
      d.deliveredAt = now;
      d.actualDeliveryTime = now;
      d.actualTimeElapsed = Math.round((now - d.createdAt) / MS_PER_MINUTE);
      d.status = "Delivered";
      await d.save();

      console.log(
        `Order ${d.orderId} - Status updated to 'Delivered' @ ${now.toISOString()}`
      );
      return res.json({ message: "Delivered", delivery: d });
    } catch (err) {
      console.error("Error in updateStatusToDelivered:", err);
      res.status(500).json({ message: "Error delivering", err });
    }
  },

  async getCurrentStatus(req, res) {
    try {
      const { deliveryId } = req.params;
      if (!deliveryId) {
        return res.status(400).json({ message: "Missing delivery ID" });
      }

      const d = await Delivery.findById(deliveryId);
      if (!d) return res.status(404).json({ message: "Not found" });

      const now = new Date(); // UTC
      let liveStatus = d.status;

      if (now < d.inTransitAt) {
        liveStatus = "Assigned";
      } else if (now < d.arrivedRestaurantAt) {
        liveStatus = "In Transit";
      } else if (!d.pickedUpAt) {
        liveStatus = "Arrived Restaurant";
      } else if (now < d.inTransitPickedUpAt) {
        liveStatus = "Picked Up";
      } else if (now < d.arrivedCustomerAt) {
        liveStatus = "In Transit - Picked Up";
      } else if (!d.deliveredAt) {
        liveStatus = "Arrived Customer";
      } else {
        liveStatus = "Delivered";
      }

      console.log(
        `Order ${d.orderId} — live status: ${liveStatus} @ ${now.toISOString()}`
      );

      let nextDestination, nextLocation, distanceToNext, etaToNext;
      if (
        ["Assigned", "In Transit", "Arrived Restaurant"].includes(liveStatus)
      ) {
        nextDestination = "restaurant";
        nextLocation = d.restaurantLocation;
        distanceToNext = calculateHaversineDistance(
          d.driverLocation.latitude,
          d.driverLocation.longitude,
          d.restaurantLocation.latitude,
          d.restaurantLocation.longitude
        );
        etaToNext = d.estimatedTimeToRestaurant;
      } else {
        nextDestination = "customer";
        nextLocation = d.customerLocation;
        distanceToNext = calculateHaversineDistance(
          d.driverLocation.latitude,
          d.driverLocation.longitude,
          d.customerLocation.latitude,
          d.customerLocation.longitude
        );
        etaToNext = d.estimatedTimeToCustomer;
      }

      return res.json({
        orderId: d.orderId,
        driverId: d.driverId,
        status: liveStatus,
        driverLocation: d.driverLocation,
        nextDestination,
        nextLocation,
        distanceToNext,
        etaToNext,
        expectedDeliveryTime: d.expectedDeliveryTime,
        createdAt: d.createdAt,
      });
    } catch (err) {
      console.error("Error in getCurrentStatus:", err);
      res.status(500).json({ message: "Error fetching status", err });
    }
  },
};

export default DeliveryStatusController;
