import fs from "fs";
import {
  registerRestaurant,
  updateRestaurantService,
} from "../services/restaurantService.js";

export const registerNewRestaurant = async (req, res) => {
  try {
    const { name, address, phone, restaurantOwner, menus } = req.body;
    const phoneRegex = /^\+?\d{10}$/;
    const imagePaths = req.files
      ? req.files.map(
          (file) =>
            `${req.protocol}://${req.get("host")}/${file.path.replace(
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
      return res.status(400).json({ message: "Invalid input data" });
    }

    const restaurantData = {
      name,
      address,
      phone,
      images: imagePaths,
      restaurantOwner,
      menus,
    };

    const newRestaurant = await registerRestaurant(restaurantData);
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
};

export const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, restaurantOwner, menus } = req.body;
  const imagePaths = req.files ? req.files.map((file) => file.path) : [];

  try {
    const updateData = {
      name,
      address,
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
};
