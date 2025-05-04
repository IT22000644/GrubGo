import React, { useState, useEffect } from 'react';
import { Cart } from './types';
import CartItemRow from './CartItemRow';
import KebabMenu from './KebabMenu';
import axios from 'axios';

interface CartModalProps {
    selectedCart: Cart;
    onClose: () => void;
    onQuantityChange: (itemId: string, quantity: number) => void;
    onPlaceOrder: (address: string) => Promise<void>;
    onClearCart: () => void;
    calculateTotalPrice: (items: Cart['items']) => string;
    showMenu: boolean;
    toggleMenu: () => void;
    defaultAddress?: string;
    isPlacingOrder: boolean;
    addressLoading: boolean;
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
    defaultAddress = '',
    isPlacingOrder,
    addressLoading
}) => {
    const [manualAddress, setManualAddress] = useState('');
    const [geoAddress, setGeoAddress] = useState('');
    const [addressType, setAddressType] = useState<'manual' | 'current' | 'default'>('default');
    const [isLocating, setIsLocating] = useState(false);
    const [geoError, setGeoError] = useState('');
    const [orderError, setOrderError] = useState('');
    const api_Key = import.meta.env.VITE_OPENCAGE_API_KEY;

    useEffect(() => {
        if (addressType === 'current') {
            getCurrentLocation();
        } else if (addressType === 'default') {
            setGeoAddress(defaultAddress);
        }
    }, [addressType, defaultAddress]);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setGeoError('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        setGeoError('');
        setGeoAddress('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                        params: {
                            key: api_Key,
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
                    setGeoError('Failed to get address from location. Using coordinates instead.');
                    setGeoAddress(`${latitude}, ${longitude}`);
                } finally {
                    setIsLocating(false);
                }
            },
            (err) => {
                console.error('Geolocation error', err);
                setGeoError('Failed to get your location. Please enable location services or enter manually.');
                setIsLocating(false);
            }
        );
    };

    const getAddressToUse = (): string => {
        switch (addressType) {
            case 'manual':
                return manualAddress.trim();
            case 'current':
                return geoAddress.trim();
            case 'default':
                return defaultAddress.trim();
            default:
                return '';
        }
    };

    const handlePlaceOrderClick = async () => {
        const address = getAddressToUse();
        if (!address) {
            setOrderError('Please enter or select a valid delivery address');
            return;
        }

        if (selectedCart.items.length === 0) {
            setOrderError('Your cart is empty');
            return;
        }

        setOrderError('');
        try {
            await onPlaceOrder(address);
        } catch (error) {
            console.error('Order placement error:', error);
            setOrderError('Failed to place order. Please try again.');
        }
    };

    const addressPlaceholder = addressLoading 
        ? 'Loading your default address...' 
        : 'No default address set';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-xl p-6 relative">
                <div className="flex flex-col items-center justify-between mb-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-500 dark:text-gray-300">
                        Cart for {selectedCart.restaurantName || selectedCart.restaurantId}
                    </h2>

                    <button 
                        onClick={onClose} 
                        className="absolute top-2 right-4 text-gray-500 hover:text-red-600 dark:hover:text-red-400 text-xl"
                        disabled={isPlacingOrder}
                    >
                        &times;
                    </button>

                    <KebabMenu 
                        showMenu={showMenu} 
                        toggleMenu={toggleMenu} 
                        onClearCart={onClearCart} 
                        disabled={isPlacingOrder}
                    />
                </div>

                {selectedCart.items.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                ) : (
                    <>
                        <div className="space-y-3 max-h-64 overflow-y-auto text-gray-500 dark:text-gray-300">
                            {selectedCart.items.map((item) => (
                                <CartItemRow
                                    key={item._id}
                                    item={item}
                                    onQuantityChange={onQuantityChange}
                                    disabled={isPlacingOrder}
                                />
                            ))}
                        </div>
                        
                        <div className="border border-black dark:border-gray-600 mt-6"></div>
                        
                        <div className="mt-4 text-left">
                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                                Delivery Address
                            </label>

                            <div className="space-y-2 mb-3">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="manual"
                                        name="addressOption"
                                        checked={addressType === 'manual'}
                                        onChange={() => setAddressType('manual')}
                                        className="mr-2"
                                        disabled={isPlacingOrder}
                                    />
                                    <label htmlFor="manual" className="dark:text-gray-300">Enter Address Manually</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="current"
                                        name="addressOption"
                                        checked={addressType === 'current'}
                                        onChange={() => setAddressType('current')}
                                        className="mr-2"
                                        disabled={isPlacingOrder}
                                    />
                                    <label htmlFor="current" className="dark:text-gray-300">Use Current Location</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="default"
                                        name="addressOption"
                                        checked={addressType === 'default'}
                                        onChange={() => setAddressType('default')}
                                        className="mr-2"
                                        disabled={isPlacingOrder || addressLoading}
                                    />
                                    <label htmlFor="default" className="dark:text-gray-300">
                                        Use Default Address
                                        {addressLoading && ' (loading...)'}
                                    </label>
                                </div>
                            </div>

                            {addressType === 'manual' && (
                                <input
                                    type="text"
                                    value={manualAddress}
                                    onChange={(e) => setManualAddress(e.target.value)}
                                    placeholder="Enter your full address"
                                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                                    disabled={isPlacingOrder}
                                />
                            )}

                            {(addressType === 'current' || addressType === 'default') && (
                                <div className={`text-sm mt-2 p-2 rounded ${
                                    geoError 
                                        ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                    {isLocating ? (
                                        'Detecting your location...'
                                    ) : addressType === 'default' && addressLoading ? (
                                        addressPlaceholder
                                    ) : getAddressToUse() || (
                                        addressType === 'default' 
                                            ? addressPlaceholder 
                                            : 'Location not available'
                                    )}
                                </div>
                            )}

                            {geoError && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                                    {geoError}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 text-right space-y-2">
                            <p className="text-lg font-semibold text-black dark:text-white">
                                Total: ${calculateTotalPrice(selectedCart.items)}
                            </p>
                            
                            {orderError && (
                                <p className="text-red-500 dark:text-red-400 text-sm text-left">
                                    {orderError}
                                </p>
                            )}
                            
                            <button
                                onClick={handlePlaceOrderClick}
                                disabled={selectedCart.items.length === 0 || isPlacingOrder}
                                className={`px-4 py-2 rounded text-white font-bold w-full flex items-center justify-center ${
                                    selectedCart.items.length === 0 || isPlacingOrder
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-orange-500 hover:bg-orange-600'
                                }`}
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartModal;