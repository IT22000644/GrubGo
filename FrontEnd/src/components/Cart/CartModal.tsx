import React, { useState, useEffect } from 'react';
import { Cart } from './types';
import CartItemRow from './CartItemRow';
import KebabMenu from './KebabMenu';
import axios from 'axios';

interface CartModalProps {
    selectedCart: Cart;
    onClose: () => void;
    onQuantityChange: (itemId: string, quantity: number) => void;
    onPlaceOrder: (address: string) => void;
    onClearCart: () => void;
    calculateTotalPrice: (items: Cart['items']) => string;
    showMenu: boolean;
    toggleMenu: () => void;
    defaultAddress?: string;
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
    defaultAddress = '123 street, city, state, zip',
}) => {
    const [manualAddress, setManualAddress] = useState('');
    const [geoAddress, setGeoAddress] = useState('');
    const [addressType, setAddressType] = useState<'manual' | 'current' | 'default'>('manual');
    const [isLocating, setIsLocating] = useState(false);
    const [geoError, setGeoError] = useState('');
    const api_Key = import.meta.env.VITE_OPENCAGE_API_KEY;


    useEffect(() => {
        if (addressType === 'current') {
            getCurrentLocation();
        } else if (addressType === 'default') {
            setGeoAddress(defaultAddress);
        }
    }, [addressType]);

    const getCurrentLocation = () => {
        setIsLocating(true);
        setGeoError('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const apiKey = api_Key;
                    const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                        params: {
                            key: apiKey,
                            q: `${latitude},${longitude}`,
                            language: 'en',
                        },
                    });

                    const results = res.data?.results;
                    if (results && results.length > 0) {
                        setGeoAddress(results[0].formatted);
                    } else {
                        setGeoAddress(`${latitude}, ${longitude}`);
                    }
                } catch (err) {
                    console.error('Reverse geocoding failed', err);
                    setGeoError('Failed to get address from location.');
                } finally {
                    setIsLocating(false);
                }
            },
            (err) => {
                console.error('Geolocation error', err);
                setGeoError('Failed to get your location.');
                setIsLocating(false);
            }
        );
    };

    const getAddressToUse = () => {
        switch (addressType) {
            case 'manual':
                return manualAddress;
            case 'current':
                return geoAddress;
            case 'default':
                return defaultAddress;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
                <div className="flex flex-col items-center justify-between mb-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-500">
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
                        <div className="space-y-3 max-h-64 overflow-y-auto text-gray-500">
                            {selectedCart.items.map((item) => (
                                <CartItemRow
                                    key={item._id}
                                    item={item}
                                    onQuantityChange={onQuantityChange}
                                />
                            ))}
                        </div>
                        <div className="border border-black mt-6"></div>
                        <div className="mt-4 text-left">
                            <label className="block text-gray-700 font-semibold mb-1">Delivery Address</label>

                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="manual"
                                        name="addressOption"
                                        checked={addressType === 'manual'}
                                        onChange={() => setAddressType('manual')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="manual">Enter Address Manually</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="current"
                                        name="addressOption"
                                        checked={addressType === 'current'}
                                        onChange={() => setAddressType('current')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="current">Use Current Location</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="default"
                                        name="addressOption"
                                        checked={addressType === 'default'}
                                        onChange={() => setAddressType('default')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="default">Use Default Address</label>
                                </div>
                            </div>

                            {addressType === 'manual' && (
                                <input
                                    type="text"
                                    value={manualAddress}
                                    onChange={(e) => setManualAddress(e.target.value)}
                                    placeholder="Enter your address"
                                    className="w-full border border-gray-300 rounded px-3 py-2 mt-3"
                                />
                            )}

                            {(addressType === 'current' || addressType === 'default') && (
                                <div className="text-sm text-gray-700 italic mt-3">
                                    {isLocating
                                        ? 'Detecting location...'
                                        : getAddressToUse() || 'No address detected yet.'}
                                </div>
                            )}

                            {geoError && <p className="text-red-500 text-sm mt-2">{geoError}</p>}
                        </div>

                        <div className="mt-6 text-right space-y-2">
                            <p className="text-lg font-semibold text-black">
                                Total: ${calculateTotalPrice(selectedCart.items)}
                            </p>
                            <button
                                onClick={() => onPlaceOrder(getAddressToUse())}
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
