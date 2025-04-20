import cron from "node-cron";
import Delivery from "../models/Delivery.js";

export function startDeliveryScheduler(io) {
  cron.schedule("*/10 * * * * *", async () => {
    const now = new Date();

    try {
      // Assigned → In Transit
      const r1 = await Delivery.updateMany(
        {
          status: "Assigned",
          assignedAt: { $lte: now },
        },
        {
          $set: {
            status: "In Transit",
            inTransitAt: now,
          },
        }
      );
      if (r1.modifiedCount > 0) {
        const updatedDeliveries = await Delivery.find({
          status: "In Transit",
          assignedAt: { $lte: now },
        });

        updatedDeliveries.forEach((d) => {
          io.emit(`delivery:${d.orderId}`, {
            status: "In Transit",
            timestamp: now,
          });
        });

        console.log(`[Scheduler] ${r1.modifiedCount} updated to In Transit`);
      }
    } catch (error) {
      console.error("Error updating to In Transit:", error);
    }

    try {
      // In Transit → Arrived Restaurant
      const deliveriesAtRestaurant = await Delivery.find({
        status: "In Transit",
        arrivedRestaurantAt: { $lte: now },
      });

      for (let d of deliveriesAtRestaurant) {
        await d.updateOne({
          $set: {
            status: "Arrived Restaurant",
            arrivedRestaurantAt: now,
            driverLocation: {
              latitude: d.restaurantLocation.latitude,
              longitude: d.restaurantLocation.longitude,
            },
          },
        });

        io.emit(`delivery:${d.orderId}`, {
          status: "Arrived Restaurant",
          timestamp: now,
        });

        console.log(`[Scheduler] Order ${d.orderId} → Arrived Restaurant`);
      }
    } catch (error) {
      console.error("Error updating to Arrived Restaurant:", error);
    }

    try {
      // Picked Up → In Transit - Picked Up
      const r3 = await Delivery.updateMany(
        {
          status: "Picked Up",
          inTransitPickedUpAt: { $lte: now },
        },
        {
          $set: {
            status: "In Transit - Picked Up",
            inTransitPickedUpAt: now,
          },
        }
      );
      if (r3.modifiedCount > 0) {
        const updatedDeliveries = await Delivery.find({
          status: "In Transit - Picked Up",
          inTransitPickedUpAt: { $lte: now },
        });

        updatedDeliveries.forEach((d) => {
          io.emit(`delivery:${d.orderId}`, {
            status: "In Transit - Picked Up",
            timestamp: now,
          });
        });

        console.log(
          `[Scheduler] ${r3.modifiedCount} updated to In Transit - Picked Up`
        );
      }
    } catch (error) {
      console.error("Error updating to In Transit - Picked Up:", error);
    }

    try {
      // In Transit - Picked Up → Arrived Customer
      const deliveriesAtCustomer = await Delivery.find({
        status: "In Transit - Picked Up",
        arrivedCustomerAt: { $lte: now },
      });

      for (let d of deliveriesAtCustomer) {
        await d.updateOne({
          $set: {
            status: "Arrived Customer",
            arrivedCustomerAt: now,
            driverLocation: {
              latitude: d.customerLocation.latitude,
              longitude: d.customerLocation.longitude,
            },
          },
        });
        io.emit(`delivery:${d.orderId}`, {
          status: "Arrived Customer",
          timestamp: now,
        });

        console.log(`[Scheduler] Order ${d.orderId} → Arrived Customer`);
      }
    } catch (error) {
      console.error("Error updating to Arrived Customer:", error);
    }
  });
}
