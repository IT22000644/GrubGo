import Restaurant from '../models/Resturant.models.js';

const restaurantController = {
  // Get all restaurants
  async getRestaurants(req, res) {
    try {
      const restaurants = await Restaurant.find();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching restaurants' });
    }
  },

  // Add dummy restaurants with updated coordinates (Colombo, Sri Lanka)
  async addDummyRestaurants(req, res) {
    try {
      const dummyRestaurants = [
        {
          name: 'Burger Heaven',
          address: '123 Main St, Colombo',
          location: { lat: 6.9271, lng: 79.8612 }, // Colombo coordinates
        },
        {
          name: 'Pizza Palace',
          address: '456 Oak St, Colombo',
          location: { lat: 6.9271, lng: 79.8612 }, // Colombo coordinates
        },
      ];

      const restaurants = await Restaurant.insertMany(dummyRestaurants);
      res.status(201).json(restaurants);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error creating dummy restaurants', error });
    }
  },
};

export default restaurantController;
