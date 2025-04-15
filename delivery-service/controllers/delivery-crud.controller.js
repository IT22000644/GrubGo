import Delivery from "../models/Delivery.js";

const DeliveryCrudController = {
  // Retrieve all deliveries
  async getAllDeliveries(req, res) {
    try {
      const deliveries = await Delivery.find({});
      res.status(200).json({
        message: "All deliveries retrieved successfully",
        deliveries,
      });
    } catch (error) {
      console.error("Error retrieving deliveries:", error);
      res.status(500).json({ message: "Error retrieving deliveries", error });
    }
  },

  // Update a delivery (by delivery ID)
  async updateDelivery(req, res) {
    try {
      const { deliveryId } = req.params;
      const updates = req.body;
      const updatedDelivery = await Delivery.findByIdAndUpdate(
        deliveryId,
        updates,
        { new: true }
      );
      if (!updatedDelivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      res.status(200).json({
        message: "Delivery updated successfully",
        delivery: updatedDelivery,
      });
    } catch (error) {
      console.error("Error updating delivery:", error);
      res.status(500).json({ message: "Error updating delivery", error });
    }
  },

  // Delete a delivery (by delivery ID)
  async deleteDelivery(req, res) {
    try {
      const { deliveryId } = req.params;
      const deletedDelivery = await Delivery.findByIdAndDelete(deliveryId);
      if (!deletedDelivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      res.status(200).json({
        message: "Delivery deleted successfully",
        delivery: deletedDelivery,
      });
    } catch (error) {
      console.error("Error deleting delivery:", error);
      res.status(500).json({ message: "Error deleting delivery", error });
    }
  },

  // Retrieve deliveries for a particular driver (by driverId)
  async getDeliveriesByDriverId(req, res) {
    try {
      const { driverId } = req.params;
      if (!driverId) {
        return res.status(400).json({ message: "Missing driver ID" });
      }
      const deliveries = await Delivery.find({ driverId });
      if (!deliveries || deliveries.length === 0) {
        return res
          .status(404)
          .json({ message: `No deliveries found for driver ID: ${driverId}` });
      }
      res.status(200).json({
        message: "Deliveries retrieved successfully",
        deliveries,
      });
    } catch (error) {
      console.error("Error retrieving deliveries by driver ID:", error);
      res.status(500).json({ message: "Error retrieving deliveries", error });
    }
  },

  // Retrieve deliveries for a particular order (by orderId, using URL params)
  async getDeliveriesByOrderId(req, res) {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        return res.status(400).json({ message: "Missing order ID" });
      }
      const deliveries = await Delivery.find({ orderId });
      if (!deliveries || deliveries.length === 0) {
        return res
          .status(404)
          .json({ message: `No deliveries found for order ID: ${orderId}` });
      }
      res.status(200).json({
        message: "Deliveries retrieved successfully",
        deliveries,
      });
    } catch (error) {
      console.error("Error retrieving deliveries by order ID:", error);
      res.status(500).json({ message: "Error retrieving deliveries", error });
    }
  },
};

export default DeliveryCrudController;
