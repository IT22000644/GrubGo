export interface UserData {
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  role: string;
  fullName?: string;
  address?: string;
  licenseNumber?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleNumber?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}
interface Address {
  shopNumber: string;
  street: string;
  town: string;
}

export interface RestaurantData {
  name: string;
  cuisine: string;
  address: Address;
  description: string;
  openingHours: string;
  restaurantOwner?: string;
  phone: string;
  images: File[];
}
