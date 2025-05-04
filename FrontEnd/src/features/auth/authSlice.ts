import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  profilePicture: string;
  role: string;
  isVerified: boolean;
  customerDetails: any;
  riderDetails: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: string | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
  loading: false,
};

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string }
>("auth/login", async (formData) => {
  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  console.log("Login Response:", response.data);
  return {
    user: response.data.data.user,
    token: response.data.data.accessToken,
  };
});

export const registerUser = createAsyncThunk<
  { user: User; accessToken: string },
  {
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    username: string;
    profilePicture: string;
    role: string;
    isVerified: boolean;
    customerDetails?: any;
    riderDetails?: any;
  }
>("auth/register", async (formData) => {
  const response = await api.post("/auth/register", formData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data.data;
});

export const logoutUser = createAsyncThunk<void, { token: string }>(
  "auth/logout",
  async ({ token }) => {
    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
  }
);

export const updateRiderStatus = createAsyncThunk<
  { riderDetails: any },
  {
    id: string;
    isAvailable: boolean;
    location?: { lat: number; lng: number };
    token: string;
  }
>("auth/updateRiderStatus", async ({ id, isAvailable, location, token }) => {
  const response = await api.patch(
    `/user/rider-status/${id}`,
    {
      isAvailable,
      location,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );

  return { riderDetails: response.data.data };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login successful:", action.payload);

        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("Login failed:", action.error);
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
        state.loading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.role = action.payload.user.role;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        console.error("Logout failed");
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
        state.loading = false;
      })
      .addCase(updateRiderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRiderStatus.fulfilled, (state, action) => {
        console.log("Rider status updated:", action.payload.riderDetails);
        if (state.user) {
          state.user.riderDetails = action.payload.riderDetails; // Only update riderDetails!
        }
        state.loading = false;
      })
      .addCase(updateRiderStatus.rejected, (state, action) => {
        console.error("Updating rider status failed:", action.error);
        state.loading = false;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
