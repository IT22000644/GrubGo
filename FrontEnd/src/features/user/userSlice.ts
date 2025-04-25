// features/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    userInfo: null,
    role: "restaurantOwner" as string | null,
    restaurantId: "68032121df9599360636551f" as string | null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
      state.role = "user";
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.role = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
