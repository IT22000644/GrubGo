import { body } from "express-validator";
import { validationResult } from "express-validator";
import fs from "fs";

export const restaurantValidationRules = [
  body("name").notEmpty().withMessage("Restaurant name is required"),
  body("address.shopNumber").notEmpty().withMessage("Shop number is required"),
  body("address.street").notEmpty().withMessage("Street is required"),
  body("address.town").notEmpty().withMessage("Town is required"),
  body("phone")
    .matches(/^\+?\d{10}$/)
    .withMessage("Phone number must be 10 digits with optional +"),
];

export const foodMenuValidationRules = [
  body("restaurant").notEmpty().withMessage("Restaurant ID is required"),
  body("title").notEmpty().withMessage("Menu title is required"),
  body("offerDiscount")
    .optional()
    .isNumeric()
    .withMessage("Offer discount must be a number"),
  body("available").optional().isBoolean(),
  body("offers").optional().isBoolean(),
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Failed to delete file:", file.path);
        });
      });
    }

    const firstError = errors.array()[0];

    return res.status(400).json({
      message: firstError.msg,
      field: firstError.path,
    });
  } else {
    next();
  }
};
