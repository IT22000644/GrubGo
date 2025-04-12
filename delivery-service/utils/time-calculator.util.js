// Calculate estimated time from a Google Maps route

export const calculateEstimatedTimeFromRoute = (route) => {
  const duration = route.legs[0].duration.value; // Duration in seconds
  return Math.round(duration / 60); // Convert seconds to minutes
};

// Calculate expected delivery time based on current time including delay (in minutes)

export const calculateExpectedDeliveryTime = (deliveryTimeInMinutes) => {
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + deliveryTimeInMinutes);
  return currentDate;
};

export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
