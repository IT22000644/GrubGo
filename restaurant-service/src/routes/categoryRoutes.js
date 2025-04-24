import express from "express";
import { categoryController } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", categoryController.addCategory);
router.delete("/:id", categoryController.deleteCategory);
router.get("/", categoryController.getAllCategory);

export default router;
