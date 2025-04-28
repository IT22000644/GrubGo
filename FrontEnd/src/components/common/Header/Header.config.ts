export const navLinks = [
  {
    name: "Home",
    path: "/",
    hasDropdown: false,
  },
  {
    name: "Menu",
    path: "/menu",
    hasDropdown: true,
    dropdownContent: [
      { name: "Pizza", path: "/menu/pizza" },
      { name: "Burgers", path: "/menu/burgers" },
      { name: "Sushi", path: "/menu/sushi" },
      { name: "Vegan", path: "/menu/vegan" },
      { name: "Desserts", path: "/menu/desserts" },
    ],
  },
  {
    name: "Restaurants",
    path: "/allRestaurants",
    hasDropdown: true,
    dropdownContent: [
      { name: "Nearby", path: "/restaurants/nearby" },
      { name: "Popular", path: "/restaurants/popular" },
      { name: "New Partners", path: "/restaurants/new" },
      { name: "All Restaurants", path: "/allRestaurants" },
    ],
  },
  {
    name: "About Us",
    path: "/about",
    hasDropdown: false,
  },
  {
    name: "Contact",
    path: "/contact",
    hasDropdown: false,
  },
];

export const adminLinks = {
  restaurantDropdownContent: [
    {
      name: "Restaurant Status",
      path: "/restaurants/nearby",
      onClick: () => {},
      visible: true,
    },
    {
      name: "Manage Restaurant",
      path: "/restaurant/manage",
    },
    {
      name: "Settings",
      path: "/",
    },
    {
      name: "Logout",
      onClick: () => console.log("All Restaurants clicked"),
    },
  ],
  userDropdownContent: [
    {
      name: "User Profile",
      path: "/restaurants/nearby",
      onClick: () => console.log("Nearby clicked"),
    },
    {
      name: "Orders",
      path: "/orders",
      onClick: () => console.log("Nearby clicked"),
    },
    {
      name: "Cart",
      path: "/cart",
      onClick: () => console.log("Cart clicked"),
    },
    {
      name: "Settings",
      onClick: () => console.log("New Partners clicked"),
    },
    {
      name: "Logout",
      onClick: () => console.log("All Restaurants clicked"),
    },
  ],
  riderDropdownContent: [
    {
      name: "Driver Status",
      path: "/restaurants/nearby",
      onClick: () => console.log("Nearby clicked"),
    },
    {
      name: "Edit Profile",
      path: "/restaurants/popular",
      onClick: () => console.log("Popular clicked"),
    },
    {
      name: "Activities",
      path: "/driver-activity",
      onClick: () => console.log("Activities clicked"),
    },
    {
      name: "Settings",
      onClick: () => console.log("New Partners clicked"),
    },
    {
      name: "Logout",
      onClick: () => console.log("All Restaurants clicked"),
    },
  ],
};
