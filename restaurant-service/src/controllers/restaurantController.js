import fs from "fs";
import {
  registerRestaurantService,
  updateRestaurantService,
  getRestaurantByIdService,
  getAllRestaurantsService,
  toggleRestaurantStatusService,
  deleteRestaurantService,
  getAllRestaurantsByStatusService,
  getRestaurantByOwnerId,
} from "../services/restaurantService.js";

export const RestaurantController = {
  registerNewRestaurant: async (req, res) => {
    try {
      const {
        name,
        address,
        description,
        phone,
        restaurantOwner,
        menus,
        isVerified,
      } = req.body;
      const phoneRegex = /^\+?\d{10}$/;
      const imagePaths = req.files
        ? req.files.map(
            (file) =>
              `${req.protocol}://${process.env.HOST_NAME}/${file.path.replace(
                /\\/g,
                "/"
              )}`
          )
        : [];

      const deleteUploadedImages = () => {
        imagePaths.forEach((path) => {
          fs.unlink(path, (err) => {
            if (err) console.error("Failed to delete file:", path);
          });
        });
      };

      if (
        !name ||
        !address.shopNumber ||
        !address.street ||
        !address.town ||
        !phone ||
        !phoneRegex.test(phone)
      ) {
        deleteUploadedImages();
        return res.status(400).json({ message: "Image Deleted." });
      }

      const restaurantData = {
        name,
        address,
        description,
        status: "open",
        phone,
        images: imagePaths,
        restaurantOwner,
        menus,
        isVerified,
      };

      const newRestaurant = await registerRestaurantService(restaurantData);

      res.status(201).json({
        message: "Restaurant added successfully!",
        restaurant: newRestaurant,
      });
    } catch (error) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file on catch:", file.path);
          });
        });
      }

      res.status(500).json({
        message: "Error adding restaurant",
        error: error.message,
      });
    }
  },

  updateRestaurant: async (req, res) => {
    const { id } = req.params;
    const {
      name,
      address,
      description,
      status,
      phone,
      restaurantOwner,
      menus,
    } = req.body;
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    try {
      const updateData = {
        name,
        address,
        description,
        status,
        phone,
        restaurantOwner,
        menus,
        images: imagePaths.length > 0 ? imagePaths : undefined,
      };

      const updatedRestaurant = await updateRestaurantService(id, updateData);

      res.status(200).json({
        message: "Restaurant updated successfully!",
        restaurant: updatedRestaurant,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating restaurant",
        error: error.message,
      });
    }
  },

  getRestaurantById: async (req, res) => {
    try {
      const { id } = req.params;

      const restaurant = await getRestaurantByIdService(id);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.status(200).json({ restaurant });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching restaurant",
        error: error.message,
      });
    }
  },

  getAllRestaurants: async (req, res) => {
    try {
      const restaurants = await getAllRestaurantsService();

      if (!restaurants || restaurants.length === 0) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.status(200).json({ restaurants });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching restaurants",
        error: error.message,
      });
    }
  },

  getAllRestaurantsByStatus: async (req, res) => {
    try {
      const restaurants = await getAllRestaurantsByStatusService();

      if (!restaurants || restaurants.length === 0) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.status(200).json({ restaurants });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching restaurants",
        error: error.message,
      });
    }
  },

  updateRestaurantStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    try {
      const updatedRestaurant = await toggleRestaurantStatusService(id, status);
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.status(200).json({
        message: `Restaurant is now ${status}`,
        restaurant: updatedRestaurant,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update status", error: error.message });
    }
  },

  deleteRestaurant: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedRestaurant = await deleteRestaurantService(id);
      if (!deletedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (deletedRestaurant.images?.length) {
        await Promise.all(
          deletedRestaurant.images.map(async (path) => {
            try {
              await fs.promises.unlink(path);
            } catch (err) {
              console.error("Failed to delete file:", path, err);
            }
          })
        );
      }

      res
        .status(200)
        .json({ message: "Restaurant and related data deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete restaurant",
        error: error.message,
      });
    }
  },

  getbyOwnerId: async (req, res) => {
    const { ownerId } = req.params;

    const restaurant = await getRestaurantByOwnerId(ownerId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    res.status(200).json({ success: true, restaurant });
  },
};

export default RestaurantController;
