import Restaurant from '../models/Resturant.models.js';

// Get all restaurants
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching restaurants' });
  }
};

// Add dummy restaurants
export const addDummyRestaurants = async (req, res) => {
  try {
    const dummyRestaurants = [
      {
        name: 'Burger Heaven',
        address: '123 Main St, City',
        location: { lat: 37.7749, lng: -122.4194 },
      },
      {
        name: 'Pizza Palace',
        address: '456 Oak St, City',
        location: { lat: 37.7899, lng: -122.4012 },
      },
    ];

    const restaurants = await Restaurant.insertMany(dummyRestaurants);
    res.status(201).json(restaurants);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating dummy restaurants', error });
  }
};
