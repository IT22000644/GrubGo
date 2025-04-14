import {
  addFoodMenuService,
  getFoodMenuByIdService,
  updateFoodMenuService,
} from "../services/foodMenuService.js";

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
    const {
      restaurant,
      title,
      available,
      offers,
      offerDiscount,
      description,
      items,
    } = req.body;

    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    try {
      const updatedData = {
        restaurant,
        title,
        available,
        offers,
        images: imagePaths.length > 0 ? imagePaths : undefined,
        offerDiscount,
        description,
        items,
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
};

export default foodMenuController;
