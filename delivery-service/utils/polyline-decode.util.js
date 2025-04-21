import pkg from "@googlemaps/polyline-codec";
const { decode } = pkg;

export function decodePolyline(encoded) {
  const decoded = decode(encoded);
  return decoded.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
}
