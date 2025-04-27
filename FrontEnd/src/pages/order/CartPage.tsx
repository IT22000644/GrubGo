import React, { useEffect, useState } from "react";
import CartCard from "../../components/Cart/CartCard";
import CartModal from "../../components/Cart/CartModal";
import { Cart, CartItem } from "../../components/Cart/types";
import api from "../../api/api";
import { ShoppingCart } from "lucide-react";


const CartPage: React.FC = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const customerId = localStorage.getItem('customerId') || "6611e8f4a1fbb93be88a1a5c";

  useEffect(() => {
    fetchCarts();
  }, [customerId]);

  const fetchCarts = async () => {
    try {
      const response = await api.get(`order/cart/${customerId}`);
      let data: Cart[] = Array.isArray(response.data)
        ? response.data
        : [response.data];

      const cartsWithNames = await Promise.all(
        data.map(async (cart) => {
          try {
            const res = await api.get(`/restaurant/${cart.restaurantId}`);
            return {
              ...cart,
              restaurantName: res.data.restaurant.name,
              restaurantImage: res.data.restaurant.images?.[0] || "",
            };
          } catch (error) {
            console.error(
              `Failed to fetch restaurant details for ${cart.restaurantId}`
            );
            return { ...cart, restaurantName: "Unknown", restaurantImage: "" };
          }
        })
      );
      setCarts(cartsWithNames);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load carts");
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
        items: updatedItems.map(({ foodItemId, quantity }) => ({
          foodItemId,
          quantity,
        })),
      };

      const res = await api.put(
        `order/cart/${customerId}/${selectedCart.restaurantId}`,
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
      console.error("Error updating quantity", err);
    }
  };

  const clearCart = async (restaurantId: string) => {
    try {
      await api.delete(`order/cart/${customerId}/${restaurantId}`);
      setSelectedCart(null);
      await fetchCarts();
      alert("Cart cleared successfully!");
    } catch (error) {
      console.error("Error clearing cart", error);
    }
  };

  const handlePlaceOrder = async (address: string) => {
    if (!selectedCart) return;

    try {
      const orderRes = await api.post("/order", {
        customerId,
        restaurantId: selectedCart.restaurantId,
        address,
      });

      const order = orderRes.data.order;

      const checkoutRes = await api.post(`/order/${order._id}/checkout/`);
      const { url } = checkoutRes.data;

      window.location.href = url;
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto  rounded-lg shadow-lg mt-10 bg-white dark:bg-slate-900 h-[65vh]">
      <div className="flex font-bold text-2xl items-center gap-5 justify-center ">Your Carts <ShoppingCart /></div>
      {error && (
        <p className="text-red-500 text-center font-medium mt-5">{error}</p>
      )}
      <div className="h-[50vh] overflow-y-auto space-y-4 pr-2 mt-3">
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
      </div>

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
