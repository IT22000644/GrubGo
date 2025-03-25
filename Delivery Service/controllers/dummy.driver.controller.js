import Driver from '../models/Driver.models.js';

const driverController = {
  // Get all available drivers
  async getAvailableDrivers(req, res) {
    try {
      const drivers = await Driver.find({ isAvailable: true });
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching drivers' });
    }
  },

  // Add dummy drivers with updated coordinates (Colombo, Sri Lanka)
  async addDummyDrivers(req, res) {
    try {
      const dummyDrivers = [
        {
          name: 'John Doe',
          phone: '1234567890',
          vehicleType: 'Bike',
          location: { lat: 6.9271, lng: 79.8612 }, // Colombo coordinates
          isAvailable: true,
        },
        {
          name: 'Jane Smith',
          phone: '0987654321',
          vehicleType: 'Car',
          location: { lat: 6.9271, lng: 79.8612 }, // Colombo coordinates
          isAvailable: true,
        },
      ];

      await Driver.insertMany(dummyDrivers);
      res.json({ message: 'Dummy drivers added' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding drivers' });
    }
  },
};

export default driverController;
