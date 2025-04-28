import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";

interface Address {
  shopNumber: string;
  street: string;
  town: string;
}

interface RestaurantData {
  _id: string;
  name: string;
  address: Address;
  description?: string;
  status?: "open" | "closed";
  phone: string;
  images: string[];
  restaurantOwner?: string;
  menus?: string[];
  isVerified?: boolean;
}

interface RestaurantState {
  restaurantData: RestaurantData | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurantData: null,
  loading: false,
  error: null,
};

export const fetchRestaurantByOwner = createAsyncThunk<
  RestaurantData, // Return type
  { ownerId: string } // Argument type
>("restaurant/fetchByOwner", async ({ ownerId }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/restaurant/owner/${ownerId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data.restaurant[0];
  } catch (error: any) {
    console.error("Failed fetching restaurant:", error);
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch restaurant"
    );
  }
});

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurantData: (state, action: PayloadAction<RestaurantData>) => {
      state.restaurantData = action.payload;
    },
    clearRestaurantData: (state) => {
      state.restaurantData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantByOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantByOwner.fulfilled, (state, action) => {
        state.restaurantData = action.payload;
        state.loading = false;
      })
      .addCase(fetchRestaurantByOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setRestaurantData, clearRestaurantData } =
  restaurantSlice.actions;

export default restaurantSlice.reducer;
