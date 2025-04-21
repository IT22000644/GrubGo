export async function fetchRoadPath(
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral,
  via?: google.maps.LatLngLiteral
): Promise<google.maps.LatLngLiteral[]> {
  const ds = new google.maps.DirectionsService();
  const req: google.maps.DirectionsRequest = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };
  if (via) {
    req.waypoints = [{ location: via, stopover: true }];
  }
  const result = await ds.route(req);
  const overview = result.routes[0].overview_polyline;

  const decoded = google.maps.geometry.encoding.decodePath(overview);
  return decoded.map((pt) => ({ lat: pt.lat(), lng: pt.lng() }));
}
