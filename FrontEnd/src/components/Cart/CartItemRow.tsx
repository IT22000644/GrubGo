import React from 'react';
import { CartItem } from './types';

interface CartItemRowProps {
    item: CartItem;
    onQuantityChange: (itemId: string, newQuantity: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onQuantityChange }) => (
    <div className="flex justify-between items-center border-b pb-2">
        <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">ID: {item.foodItemId}</p>
        </div>
        <div className="flex items-center space-x-2">
            <input
                type="number"
                value={item.quantity}
                min={0}
                onChange={(e) => onQuantityChange(item._id, Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-center"
            />
            <p className="text-right w-20">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    </div>
);

export default CartItemRow;

