import cron from "node-cron";
import Delivery from "../models/Delivery.js";
import { getDirections } from "./google-maps.service.js";
import { decodePolyline } from "../utils/polyline-decode.util.js";

function calculateProgress(startTime, endTime) {
  const now = new Date();
  const total = endTime - startTime;
  const elapsed = now - startTime;
  return Math.min(1, elapsed / total);
}

export function startDriverLocationUpdater(io) {
  cron.schedule("*/30 * * * * *", async () => {
    const now = new Date();

    const toRest = await Delivery.find({
      status: "In Transit",
      inTransitAt: { $lte: now },
      arrivedRestaurantAt: { $gt: now },
    });

    for (const d of toRest) {
      const progress = calculateProgress(d.inTransitAt, d.arrivedRestaurantAt);

      const route = await getDirections(
        `${d.driverLocation.latitude},${d.driverLocation.longitude}`,
        `${d.restaurantLocation.latitude},${d.restaurantLocation.longitude}`
      );

      const polyline = route.data.routes[0].overview_polyline.points;
      const coords = decodePolyline(polyline);
      const index = Math.floor(progress * (coords.length - 1));
      const driverLoc = coords[index];

      await Delivery.updateOne(
        { _id: d._id },
        { $set: { driverLocation: driverLoc } }
      );

      console.log(
        `[Location Update] Order - ${d.orderId} - Moving to Restaurant`
      );
    }

    const toCust = await Delivery.find({
      status: "In Transit - Picked Up",
      inTransitPickedUpAt: { $lte: now },
      arrivedCustomerAt: { $gt: now },
    });

    for (const d of toCust) {
      const progress = calculateProgress(
        d.inTransitPickedUpAt,
        d.arrivedCustomerAt
      );

      const route = await getDirections(
        `${d.restaurantLocation.latitude},${d.restaurantLocation.longitude}`,
        `${d.customerLocation.latitude},${d.customerLocation.longitude}`
      );

      const polyline = route.data.routes[0].overview_polyline.points;
      const coords = decodePolyline(polyline);
      const index = Math.floor(progress * (coords.length - 1));
      const driverLoc = coords[index];

      await Delivery.updateOne(
        { _id: d._id },
        { $set: { driverLocation: driverLoc } }
      );

      console.log(
        `[Location Update] Order - ${d.orderId} - Moving to Customer`
      );
    }
  });
}
