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
      const { driverLocation } = req.body;

      if (!deliveryId || !driverLocation) {
        return res.status(400).json({
          message: "Missing delivery ID or driver location",
        });
      }

      const d = await Delivery.findById(deliveryId);
      if (!d) return res.status(404).json({ message: "Delivery not found" });

      const now = new Date();
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

      let nextDestination;
      let nextLocation;
      let distanceToNext;
      let etaToNext;

      if (liveStatus === "Arrived Restaurant") {
        nextDestination = "Pending Pickup";
        nextLocation = d.customerLocation;
        distanceToNext = "Pending Pickup";
        etaToNext = 0;
      } else if (liveStatus === "Arrived Customer") {
        nextDestination = "Delivery Completion";
        nextLocation = "Delivery Completion";
        distanceToNext = 0;
        etaToNext = 0;
      } else if (
        [
          "Assigned",
          "In Transit",
          "Picked Up",
          "In Transit - Picked Up",
        ].includes(liveStatus)
      ) {
        const isGoingToRestaurant = ["Assigned", "In Transit"].includes(
          liveStatus
        );
        nextDestination = isGoingToRestaurant ? "restaurant" : "customer";
        nextLocation = isGoingToRestaurant
          ? d.restaurantLocation
          : d.customerLocation;

        distanceToNext = calculateHaversineDistance(
          driverLocation.latitude,
          driverLocation.longitude,
          nextLocation.latitude,
          nextLocation.longitude
        );

        etaToNext = isGoingToRestaurant
          ? d.estimatedTimeToRestaurant
          : d.estimatedTimeToCustomer;
      } else {
        // Final fallback for Delivered
        nextDestination = "None";
        nextLocation = "N/A";
        distanceToNext = 0;
        etaToNext = 0;
      }

      return res.json({
        orderId: d.orderId,
        driverId: d.driverId,
        status: liveStatus,
        driverLocation,
        restaurantLocation: d.restaurantLocation,
        customerLocation: d.customerLocation,
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
