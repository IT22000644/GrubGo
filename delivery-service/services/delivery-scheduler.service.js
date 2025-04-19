import cron from "node-cron";
import Delivery from "../models/Delivery.js";

export function startDeliveryScheduler() {
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
      if (r1.nModified)
        console.log(
          `[Scheduler] Order - ${r1.nModified} - Status Updated ( Assigned → In Transit ) `
        );
    } catch (error) {
      console.error("Error updating status to In Transit:", error);
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
        console.log(
          `[Scheduler] Order - ${d.orderId} - Status Updated ( In Transit → Arrived Restaurant )`
        );
      }
    } catch (error) {
      console.error("Error updating status to Arrived Restaurant:", error);
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
      if (r3.nModified)
        console.log(
          `[Scheduler] Order - ${r3.nModified} - Status Updated ( Picked Up → In Transit - Picked Up ) `
        );
    } catch (error) {
      console.error("Error updating status to In Transit - Picked Up:", error);
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
        console.log(
          `[Scheduler] Order - ${d.orderId} - Status Updated ( In Transit - Picked Up → Arrived Customer )`
        );
      }
    } catch (error) {
      console.error("Error updating status to Arrived Customer:", error);
    }
  });
}
