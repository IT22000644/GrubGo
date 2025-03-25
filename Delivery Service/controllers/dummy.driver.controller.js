import Driver from '../models/Driver.models.js';

// Get all available drivers
export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ isAvailable: true });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching drivers' });
  }
};

// Add dummy drivers
export const addDummyDrivers = async (req, res) => {
  try {
    const dummyDrivers = [
      {
        name: 'John Doe',
        phone: '1234567890',
        vehicleType: 'Bike',
        location: { lat: 40.7128, lng: -74.006 },
        isAvailable: true,
      },
      {
        name: 'Jane Smith',
        phone: '0987654321',
        vehicleType: 'Car',
        location: { lat: 40.7306, lng: -73.9352 },
        isAvailable: true,
      },
    ];

    await Driver.insertMany(dummyDrivers);
    res.json({ message: 'Dummy drivers added' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding drivers' });
  }
};
