import mapService from "../services/map.service.js";

const convertAddress = async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const coordinates = await mapService.getCoordinates(address);
    res.json(coordinates);
  } catch (error) {
    console.error("Error converting address:", error.message);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

export default { convertAddress };
