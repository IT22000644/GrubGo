import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.send("Hello from user service!");
});

router.get("/", (req, res) => {
  // TODO
});

router.get("/:id", (req, res) => {
  // TODO
});

router.get("/email/:email", (req, res) => {
  // TODO
});

router.post("/", (req, res) => {
  // TODO
});

router.put("/:id", (req, res) => {
  // TODO
});

router.patch("/update-location/:id", (req, res) => {
  // TODO
});

router.delete("/active-riders", (req, res) => {
  // TODO
});

export default router;
