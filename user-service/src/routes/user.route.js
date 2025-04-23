import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from user service!");
});

router.get("/users", (req, res) => {
  // TODO
});

router.get("/users/:id", (req, res) => {
  // TODO
});

router.post("/users", (req, res) => {
  // TODO
});

router.put("/users/:id", (req, res) => {
  // TODO
});

router.patch("/users/update-location/:id", (req, res) => {
  // TODO
});

router.delete("/users/active-riders", (req, res) => {
  // TODO
});
