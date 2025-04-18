import cron from "node-cron";
import Delivery from "../models/Delivery.js";

export function startDeliveryScheduler() {
  cron.schedule("*/10 * * * * *", async () => {
    const now = new Date();

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
      console.log(`[Scheduler] Assigned→In Transit: ${r1.nModified}`);

    // In Transit → Arrived Restaurant
    const r2 = await Delivery.updateMany(
      {
        status: "In Transit",
        arrivedRestaurantAt: { $lte: now },
      },
      {
        $set: {
          status: "Arrived Restaurant",
          arrivedRestaurantAt: now,
        },
      }
    );
    if (r2.nModified)
      console.log(`[Scheduler] In Transit→Arrived Restaurant: ${r2.nModified}`);

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
        `[Scheduler] Picked Up→In Transit - Picked Up: ${r3.nModified}`
      );

    // In Transit - Picked Up → Arrived Customer
    const r4 = await Delivery.updateMany(
      {
        status: "In Transit - Picked Up",
        arrivedCustomerAt: { $lte: now },
      },
      {
        $set: {
          status: "Arrived Customer",
          arrivedCustomerAt: now,
        },
      }
    );
    if (r4.nModified)
      console.log(
        `[Scheduler] In Transit - Picked Up→Arrived Customer: ${r4.nModified}`
      );
  });
}
