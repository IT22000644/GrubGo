import mapService from "../services/map.service.js";
import GeoService from "../services/geo.service.js";

const MapController = {
  // Convert full address OR address parts to coordinates
  async addressToCoordinates(req, res) {
    const { address, addressParts } = req.body;

    try {
      let fullAddress = address;
      if (addressParts) {
        fullAddress = mapService.formatAddressParts(addressParts);
      }

      if (!fullAddress) {
        return res.status(400).json({ error: "Address is required" });
      }

      const coordinates = await mapService.getCoordinates(fullAddress);

      if (!coordinates) {
        return res.status(404).json({ error: "Address not found" });
      }

      return res.json(coordinates);
    } catch (error) {
      console.error("Error converting address:", error.message);
      return res
        .status(500)
        .json({ error: "Server error", message: error.message });
    }
  },

  // Convert coordinates to an Address
  async coordinatesToAddress(req, res) {
    const { latitude, longitude, lat, lng } = req.body;
    const actualLat = latitude ?? lat;
    const actualLng = longitude ?? lng;

    if (actualLat == null || actualLng == null) {
      return res.status(400).json({
        error: "Latitude and longitude (or lat and lng) are required",
      });
    }

    try {
      const address = await mapService.getAddressFromCoordinates(
        actualLat,
        actualLng
      );

      if (!address) {
        return res
          .status(404)
          .json({ error: "No address found for these coordinates" });
      }

      return res.json({ address });
    } catch (error) {
      console.error("Error converting coordinates:", error.message);
      return res
        .status(500)
        .json({ error: "Server error", message: error.message });
    }
  },

  // Combine address parts into one string
  combineAddressParts(req, res) {
    const { addressParts } = req.body;

    if (!addressParts) {
      return res.status(400).json({ error: "Address parts are required" });
    }

    const fullAddress = mapService.formatAddressParts(addressParts);
    return res.json({ fullAddress });
  },

  // Find the closest address to the Base Address
  async findClosestAddress(req, res) {
    const { baseAddress, addresses } = req.body;

    if (
      !baseAddress ||
      !addresses ||
      !Array.isArray(addresses) ||
      addresses.length === 0
    ) {
      return res
        .status(404)
        .json({ error: "Base address and list of addresses are required" });
    }

    try {
      const baseFullAddress =
        baseAddress.address ||
        mapService.formatAddressParts(baseAddress.addressParts);

      const baseCoords = await mapService.getCoordinates(baseFullAddress);
      if (!baseCoords) {
        return res
          .status(404)
          .json({ error: "Base address could not be geocoded" });
      }

      let closest = null;
      let minDistance = Infinity;

      for (const addr of addresses) {
        try {
          const full =
            addr.address || mapService.formatAddressParts(addr.addressParts);

          const coords = await mapService.getCoordinates(full);
          if (!coords) continue;

          const distance = GeoService.calculateHaversineDistance(
            baseCoords.latitude,
            baseCoords.longitude,
            coords.latitude,
            coords.longitude
          );

          if (distance < minDistance) {
            minDistance = distance;
            closest = {
              id: addr.id,
              address: full,
              coordinates: coords,
              distance,
            };
          }
        } catch (innerErr) {
          console.warn(`Skipping address due to error: ${innerErr.message}`);
          continue;
        }
      }

      if (!closest) {
        return res
          .status(404)
          .json({ error: "No valid addresses could be geocoded" });
      }

      return res.json(closest);
    } catch (error) {
      console.error("Error finding closest address:", error.message);
      return res
        .status(500)
        .json({ error: "Server error", message: error.message });
    }
  },

  // Find the closest rider to a base coordinate
  async findClosestRider(req, res) {
    const { baseLocation, data } = req.body;

    if (
      !baseLocation ||
      typeof baseLocation.lat !== "number" ||
      typeof baseLocation.lng !== "number" ||
      !Array.isArray(data) ||
      data.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Base location and rider list are required" });
    }

    try {
      let closest = null;
      let minDistance = Infinity;

      for (const rider of data) {
        const coords = rider.currentLocation;
        if (
          !coords ||
          typeof coords.lat !== "number" ||
          typeof coords.lng !== "number"
        ) {
          continue;
        }

        const distance = GeoService.calculateHaversineDistance(
          baseLocation.lat,
          baseLocation.lng,
          coords.lat,
          coords.lng
        );

        if (distance < minDistance) {
          minDistance = distance;
          closest = {
            id: rider.userId,
            currentLocation: coords,
            distance,
          };
        }
      }

      if (!closest) {
        return res
          .status(404)
          .json({ error: "No valid rider locations found" });
      }

      return res.json(closest);
    } catch (error) {
      console.error("Error finding closest rider:", error.message);
      return res
        .status(500)
        .json({ error: "Server error", message: error.message });
    }
  },
};

export default MapController;
