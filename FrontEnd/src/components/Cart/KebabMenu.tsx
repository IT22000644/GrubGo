import React from 'react';

interface KebabMenuProps {
    showMenu: boolean;
    toggleMenu: () => void;
    onClearCart: () => void;
}

const KebabMenu: React.FC<KebabMenuProps> = ({ showMenu, toggleMenu, onClearCart }) => (
    <div className="absolute top-2 left-4">
        <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-black text-2xl"
        >
            &#8942;
        </button>
        {showMenu && (
            <div className="absolute bg-white border rounded shadow-md mt-2 z-10">
                <button
                    onClick={onClearCart}
                    className="block px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 w-52 text-center"
                >
                    Clear Cart
                </button>
            </div>
        )}
    </div>
);

export default KebabMenu;
