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
}

export interface RestaurantData {
  name: string;
  cuisine: string;
  address: string;
  description: string;
  openingHours: string;
  phone: string;
  images: string[];
}
