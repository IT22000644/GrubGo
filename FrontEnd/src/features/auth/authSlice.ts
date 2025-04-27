import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";

interface User {
  id: string;
  name: string;
  email: string;
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
  { user: User; token: string },
  any
>("auth/register", async (formData) => {
  const response = await api.post("/auth/register", formData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
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
        state.role = action.payload.user.role; // Store the role
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
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
