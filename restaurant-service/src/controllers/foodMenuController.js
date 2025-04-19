import {
  addFoodMenuService,
  deleteFoodMenuService,
  getFoodMenuByIdService,
  getMenuWithItemsService,
  updateFoodMenuService,
} from "../services/foodMenuService.js";
import { updateRestaurantService } from "../services/restaurantService.js";

export const foodMenuController = {
  addFoodMenu: async (req, res) => {
    try {
      const {
        restaurant,
        title,
        available,
        offers,
        offerDiscount,
        description,
        items,
      } = req.body;

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

      if (!title || !restaurant) {
        deleteUploadedImages();
        return res.status(400).json({ message: "Image Deleted." });
      }

      const menuData = {
        restaurant,
        title,
        available,
        offers,
        images: imagePaths,
        offerDiscount,
        description,
        items,
      };

      const newMenu = await addFoodMenuService(menuData);
      if (restaurant) {
        await updateRestaurantService(restaurant, {
          $push: { menus: menuData._id },
        });
      }
      res.status(201).json({
        message: "Food menu added successfully.",
        menu: newMenu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add food menu.",
        error: error.message,
      });
    }
  },

  updateFoodMenu: async (req, res) => {
    const { id } = req.params;
    const { restaurant, title, available, offers, offerDiscount, description } =
      req.body;

    const imagePaths = req.files
      ? req.files.map(
          (file) =>
            `${req.protocol}://${req.get("host")}/${file.path.replace(
              /\\/g,
              "/"
            )}`
        )
      : [];

    try {
      const updatedData = {
        restaurant,
        title,
        available,
        offers,
        images: imagePaths.length > 0 ? imagePaths : undefined,
        offerDiscount,
        description,
      };

      const updatedMenu = await updateFoodMenuService(id, updatedData);

      if (!updatedMenu) {
        return res.status(404).json({ message: "Food menu not found" });
      }

      res.status(200).json({
        message: "Food menu updated successfully",
        menu: updatedMenu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating food menu",
        error: error.message,
      });
    }
  },

  getFoodMenuById: async (req, res) => {
    try {
      const { id } = req.params;

      const menu = await getFoodMenuByIdService(id);

      if (!menu) {
        return res.status(404).json({ message: "Food menu not found" });
      }

      res.status(200).json({ menu });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching food menu",
        error: error.message,
      });
    }
  },
  getFoodsByMenu: async (req, res) => {
    const { id } = req.params;

    try {
      const menuItems = await getMenuWithItemsService(id);

      if (!menuItems) {
        return res.status(404).json({ message: "Food menu not found" });
      }

      res.status(200).json({ foods: menuItems.items });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching foods by menu",
        error: error.message,
      });
    }
  },
  deleteFoodMenu: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedMenu = await deleteFoodMenuService(id);

      if (!deletedMenu) {
        return res.status(404).json({ message: "Food menu not found" });
      }

      if (deletedMenu.images?.length) {
        await Promise.all(
          deletedMenu.images.map(async (path) => {
            try {
              await fs.promises.unlink(path);
            } catch (err) {
              console.error("Failed to delete file:", path, err);
            }
          })
        );
      }

      return res.status(200).json({
        message: "Food menu and associated foods deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete food menu",
        error: error.message,
      });
    }
  },
};
