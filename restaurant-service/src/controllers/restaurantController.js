exports.getAllRestaurants = (req, res) => {
  res.json([
    { id: 1, name: "Pasta Palace" },
    { id: 2, name: "Sushi World" },
  ]);
};
