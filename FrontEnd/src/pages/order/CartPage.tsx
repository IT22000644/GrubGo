import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartCard from '../../components/Cart/CartCard';
import CartModal from '../../components/Cart/CartModal';
import { Cart, CartItem } from '../../components/Cart/types';
import OrderPage from './OrderPage';

interface CartPageProps {
    customerId: string;
}

const CartPage: React.FC<CartPageProps> = ({ customerId }) => {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'cart' | 'order'>('cart');

    useEffect(() => {
        fetchCarts();
    }, [customerId]);

    const fetchCarts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/${customerId}`);
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setCarts(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load carts');
        }
    };

    const calculateTotalPrice = (items: CartItem[]) =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const handleQuantityChange = async (itemId: string, newQuantity: number) => {
        if (!selectedCart) return;

        const updatedItems = selectedCart.items.map((item) =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
        );

        try {
            const payload = {
                items: updatedItems.map(({ foodItemId, quantity }) => ({ foodItemId, quantity })),
            };

            const res = await axios.put(
                `http://localhost:5000/api/cart/${customerId}/${selectedCart.restaurantId}`,
                payload
            );

            if (res.data.cart) {
                setSelectedCart(res.data.cart);
                await fetchCarts();
            } else {
                setSelectedCart(null);
                await fetchCarts();
            }
        } catch (err) {
            console.error('Error updating quantity', err);
        }
    };

    const clearCart = async (restaurantId: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/${customerId}/${restaurantId}`);
            setSelectedCart(null);
            await fetchCarts();
            alert('Cart cleared successfully!');
        } catch (error) {
            console.error('Error clearing cart', error);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedCart) return;

        try {
            const orderRes = await axios.post('http://localhost:5000/api/orders', {
                customerId,
                restaurantId: selectedCart.restaurantId,
            });

            const order = orderRes.data.order;

            const checkoutRes = await axios.post(`http://localhost:5000/api/orders/${order._id}/checkout/`);
            const { url } = checkoutRes.data;

            window.location.href = url;
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto border border-black dark:border-slate-700 rounded-lg shadow-lg mt-20 bg-white dark:bg-slate-900">
        <div className="flex justify-center mb-6">
            <button
                onClick={() => setSelectedTab('cart')}
                className={`px-4 py-2 font-semibold rounded-l-lg border border-black dark:border-slate-700 w-full ${
                    selectedTab === 'cart'
                        ? 'bg-black text-white'
                        : 'bg-white text-black dark:bg-slate-800 dark:text-white'
                }`}
            >
                Cart
            </button>
            <button
                onClick={() => setSelectedTab('order')}
                className={`px-4 py-2 font-semibold rounded-r-lg border border-black dark:border-slate-700 w-full ${
                    selectedTab === 'order'
                        ? 'bg-black text-white'
                        : 'bg-white text-black dark:bg-slate-800 dark:text-white'
                }`}
            >
                Orders
            </button>
        </div>
    
        {selectedTab === 'cart' ? (
            <>
                {error && <p className="text-red-500">{error}</p>}
                {carts.map((cart) => (
                    <CartCard
                        key={cart._id}
                        cart={cart}
                        calculateTotalPrice={calculateTotalPrice}
                        onView={() => {
                            setSelectedCart(cart);
                            setShowMenu(false);
                        }}
                    />
                ))}
            </>
        ) : (
            <OrderPage customerId={customerId} />
        )}
    
        {selectedCart && (
            <CartModal
                selectedCart={selectedCart}
                onClose={() => {
                    setSelectedCart(null);
                    setShowMenu(false);
                }}
                onQuantityChange={handleQuantityChange}
                onPlaceOrder={handlePlaceOrder}
                onClearCart={() => clearCart(selectedCart.restaurantId)}
                calculateTotalPrice={calculateTotalPrice}
                showMenu={showMenu}
                toggleMenu={() => setShowMenu((prev) => !prev)}
            />
        )}
    </div>
    
    );
};

export default CartPage;
