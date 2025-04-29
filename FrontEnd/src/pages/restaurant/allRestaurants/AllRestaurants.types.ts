export type Restaurant = {
  _id: string;
  name: string;
  phone: string;
  status: string;
  address: Address;
  images: string[];
  menus: FoodMenu[];
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
};

export type Address = {
  shopNumber: string;
  street: string;
  town: string;
};

export type FoodMenu = {
  _id: string;
  restaurant: string;
  title: string;
  available: boolean;
  offers: boolean;
  offerDiscount: number;
  description: string;
  images: string[];
  items: Food[];
};

export type Category = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Food = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  category: Category;
};
