import React from 'react';
import { Cart } from './types';
import CartItemRow from './CartItemRow';
import KebabMenu from './KebabMenu';

interface CartModalProps {
    selectedCart: Cart;
    onClose: () => void;
    onQuantityChange: (itemId: string, quantity: number) => void;
    onPlaceOrder: () => void;
    onClearCart: () => void;
    calculateTotalPrice: (items: Cart['items']) => string;
    showMenu: boolean;
    toggleMenu: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
    selectedCart,
    onClose,
    onQuantityChange,
    onPlaceOrder,
    onClearCart,
    calculateTotalPrice,
    showMenu,
    toggleMenu,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
                <div className="flex flex-col items-center justify-between mb-4">
                    <h2 className="text-xl font-bold mb-4  text-gray-500">
                        Cart for {selectedCart.restaurantName || selectedCart.restaurantId}
                    </h2>

                    <button onClick={onClose} className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-xl">
                        &times;
                    </button>

                    <KebabMenu showMenu={showMenu} toggleMenu={toggleMenu} onClearCart={onClearCart} />
                </div>

                {selectedCart.items.length === 0 ? (
                    <p className="text-gray-500">Cart is empty.</p>
                ) : (
                    <>
                        <div className="space-y-3 max-h-64 overflow-y-auto  text-gray-500">
                            {selectedCart.items.map((item) => (
                                <CartItemRow
                                    key={item._id}
                                    item={item}
                                    onQuantityChange={onQuantityChange}
                                />
                            ))}
                        </div>
                        <div className="mt-4 text-right space-y-2">
                            <p className="text-lg font-semibold  text-black">
                                Total: ${calculateTotalPrice(selectedCart.items)}
                            </p>
                            <button
                                onClick={onPlaceOrder}
                                disabled={selectedCart.items.length === 0}
                                className={`px-4 py-2 rounded text-white font-bold w-full ${selectedCart.items.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-orange-400 hover:bg-orange-500'
                                    }`}
                            >
                                Place Order
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartModal;
