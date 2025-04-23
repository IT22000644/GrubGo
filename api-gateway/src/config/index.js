export default {
  userService: process.env.USER_SERVICE_URL || "http://localhost:5000",
  authService: process.env.AUTH_SERVICE_URL || "http://localhost:5001",
  restaurantService:
    process.env.RESTAURANT_SERVICE_URL || "http://localhost:5002",
  orderService: process.env.ORDER_SERVICE_URL || "http://localhost:5003",
  paymentService: process.env.PAYMENT_SERVICE_URL || "http://localhost:5004",
  notificationService:
    process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5005",
  reviewService: process.env.REVIEW_SERVICE_URL || "http://localhost:5006",
  deliveryService: process.env.DELIVERY_SERVICE_URL || "http://localhost:5007",
};
