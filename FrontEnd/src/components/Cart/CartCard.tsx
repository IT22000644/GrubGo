import React from 'react';
import { CircleChevronRight } from 'lucide-react';
import { Cart } from './types';

interface CartCardProps {
    cart: Cart;
    onView: () => void;
    calculateTotalPrice: (items: Cart['items']) => string;
}

const CartCard: React.FC<CartCardProps> = ({ cart, onView, calculateTotalPrice }) => (
    <div className="border rounded-xl shadow-md mb-4 p-4 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {cart.restaurantImage && (
            <img
              src={cart.restaurantImage}
              alt={cart.restaurantName}
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">
              Restaurant: {cart.restaurantName || 'Unnamed Restaurant'}
            </h2>
            <p>Total Items: {cart.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
            <p className="text-lg font-semibold">Total: ${calculateTotalPrice(cart.items)}</p>
          </div>
        </div>
        <button onClick={onView} className="text-white px-4 py-2 rounded">
          <CircleChevronRight fill="black" color="white" size={40} />
        </button>
      </div>
    </div>
  );
  

export default CartCard;
