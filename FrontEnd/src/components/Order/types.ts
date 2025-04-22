export interface OrderItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    foodItemId: string;
}

export interface Order {
    _id: string;
    customerId: string;
    restaurantId: string;
    restaurantName: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
    totalAmount: number;
    currency: string;
}
