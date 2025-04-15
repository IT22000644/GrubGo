import Delivery from "../models/Delivery.js";

const DeliveryStatusController = {
  // Method to update the status to "Picked Up".

  async updateStatusToPickedUp(req, res) {
    try {
      const { deliveryId } = req.body;
      if (!deliveryId) {
        return res.status(400).json({ message: "Missing delivery ID" });
      }

      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }

      if (delivery.status !== "Arrived Restaurant") {
        return res.status(400).json({ message: "Cannot Update Status" });
      }

      // Manually update status to "Picked Up"
      delivery.status = "Picked Up";
      await delivery.save();
      console.log(`Order ${delivery.orderId} - Status updated to 'Picked Up'`);

      // After 10 seconds from "Picked Up", update status to "In Transit - Picked Up"
      setTimeout(async () => {
        delivery.status = "In Transit - Picked Up";
        await delivery.save();
        console.log(
          `Order ${delivery.orderId} - Status updated to 'In Transit - Picked Up'`
        );

        // After the estimated time to customer elapses, update status to "Arrived Customer"

        const estimatedTimeToCustomer = delivery.estimatedTimeToCustomer;

        if (!estimatedTimeToCustomer) {
          console.log(
            `Order ${delivery.orderId} - No estimated time to customer stored.`
          );
        }

        setTimeout(async () => {
          delivery.status = "Arrived Customer";
          await delivery.save();
          console.log(
            `Order ${delivery.orderId} - Status updated to 'Arrived Customer'`
          );
        }, estimatedTimeToCustomer * 60000);
      }, 10000); // 10 seconds delay after "Picked Up"

      res.status(200).json({
        message: "Status updated to Picked Up. Delivery process continuing.",
        delivery,
      });
    } catch (error) {
      console.error("Error in updateStatusToPickedUp:", error);
      res.status(500).json({
        message: "Error updating delivery status to Picked Up",
        error,
      });
    }
  },

  // Method to update the status to "Delivered"
  async updateStatusToDelivered(req, res) {
    try {
      const { deliveryId } = req.body;
      if (!deliveryId) {
        return res.status(400).json({ message: "Missing delivery ID" });
      }
      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }

      if (delivery.status !== "Arrived Customer") {
        return res.status(400).json({ message: "Cannot Update Status" });
      }

      // Manually update status to "Delivered"
      delivery.status = "Delivered";
      const actualDeliveryTime = new Date();
      delivery.actualDeliveryTime = actualDeliveryTime;
      delivery.actualTimeElapsed = Math.round(
        (actualDeliveryTime - delivery.createdAt) / 60000
      );

      await delivery.save();
      console.log(`Order ${delivery.orderId} - Status updated to 'Delivered'`);
      res.status(200).json({
        message: "Status updated to Delivered",
        delivery,
      });
    } catch (error) {
      console.error("Error in updateStatusToDelivered:", error);
      res.status(500).json({
        message: "Error updating delivery status to Delivered",
        error,
      });
    }
  },
};

export default DeliveryStatusController;
