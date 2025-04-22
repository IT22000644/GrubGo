export interface CartItem {
    _id: string;
    foodItemId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    _id: string;
    customerId: string;
    restaurantId: string;
    restaurantName?: string;
    items: CartItem[];
}
