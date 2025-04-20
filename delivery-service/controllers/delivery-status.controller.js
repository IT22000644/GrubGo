import Delivery from "../models/Delivery.js";
import { calculateHaversineDistance } from "../utils/time-calculator.util.js";

const TEN_SECONDS = 10 * 1000;
const ONE_SECOND = 1 * 1000;

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
        d.inTransitPickedUpAt.getTime() + d.estimatedTimeToCustomer * ONE_SECOND
      );

      d.expectedDeliveryTime = new Date(
        d.inTransitPickedUpAt.getTime() + d.estimatedTimeToCustomer * ONE_SECOND
      );

      d.status = "Picked Up";
      await d.save();

      const io = req.app.get("io");
      io.emit(`delivery:${d.orderId}`, {
        status: "Picked Up",

        timestamp: now,
      });

      console.log(
        `[Update] Order ${d.orderId} - Status updated to 'Picked Up'`
      );
      return res.json({ message: "Picked Up", delivery: d });
    } catch (err) {
      console.error("Error in updateStatusToPickedUp:", err);
      res.status(500).json({ message: "Error picking up", err });
    }
  },

  // Method to update the status to "Delivered".
  async updateStatusToDelivered(req, res) {
    try {
      const { deliveryId } = req.body;
      const d = await Delivery.findById(deliveryId);
      if (!d || d.status !== "Arrived Customer") {
        return res.status(400).json({ message: "Cannot deliver yet" });
      }

      const now = new Date();
      d.deliveredAt = now;
      d.actualDeliveryTime = now;
      d.actualTimeElapsed = Math.round((now - d.createdAt) / ONE_SECOND);
      d.status = "Delivered";
      await d.save();

      const io = req.app.get("io");
      io.emit(`delivery:${d.orderId}`, {
        status: "Delivered",

        timestamp: now,
      });

      console.log(
        `[Update] Order ${d.orderId} - Status updated to 'Delivered' `
      );
      return res.json({ message: "Delivered", delivery: d });
    } catch (err) {
      console.error("Error in updateStatusToDelivered:", err);
      res.status(500).json({ message: "Error delivering", err });
    }
  },

  // Method to check the current status of the Delivery
  async getCurrentStatus(req, res) {
    try {
      const { deliveryId } = req.params;

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
          d.driverLocation.latitude,
          d.driverLocation.longitude,
          nextLocation.latitude,
          nextLocation.longitude
        );

        etaToNext = isGoingToRestaurant
          ? d.estimatedTimeToRestaurant
          : d.estimatedTimeToCustomer;
      } else {
        nextDestination = "None";
        nextLocation = "None";
        distanceToNext = 0;
        etaToNext = 0;
      }

      return res.json({
        orderId: d.orderId,
        driverId: d.driverId,
        status: liveStatus,
        driverLocation: d.driverLocation,
        restaurantLocation: d.restaurantLocation,
        customerLocation: d.customerLocation,
        nextDestination,
        nextLocation,
        distanceToNext,
        etaToNext,
        expectedDeliveryTime: d.expectedDeliveryTime,
        estimatedTimeToRestaurant: d.estimatedTimeToRestaurant,
        estimatedTimeToCustomer: d.estimatedTimeToCustomer,
        createdAt: d.createdAt,
      });
    } catch (err) {
      console.error("Error in getCurrentStatus:", err);
      res.status(500).json({ message: "Error fetching status", err });
    }
  },
};

export default DeliveryStatusController;
