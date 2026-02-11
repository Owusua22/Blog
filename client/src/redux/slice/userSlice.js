// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  updateUser,
  setAuthToken,
} from "../../api";

/**
 * BACKEND RESPONSE SHAPES (based on your controllers):
 *
 * User register/login:
 *  {
 *    token: "...",
 *    user: { id, name, email, role }
 *  }
 *
 * Admin register:
 *  {
 *    token: "...",
 *    admin: { id, name, email, role }
 *  }
 *
 * Admin login:
 *  {
 *    token: "...",
 *    admin: { id, name, email, role }
 *  }
 */

// ---------- helpers ----------
const saveToken = (token) => {
  if (!token) return;
  localStorage.setItem("token", token);
  setAuthToken(token);
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  setAuthToken(null);
};

// Hydrate auth header on refresh
const bootToken = localStorage.getItem("token");
if (bootToken) setAuthToken(bootToken);

// ================= THUNKS =================

// USER REGISTER (auto-login)
export const userRegister = createAsyncThunk(
  "auth/userRegister",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUser(data);

      // must match backend: res.data.token
      saveToken(res.data.token);

      // must match backend: res.data.user
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// USER LOGIN
export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);

      saveToken(res.data.token);

      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ADMIN REGISTER (optional: auto-login or not)
// Your backend returns { token, admin }. If you truly want "NO AUTO LOGIN",
// then do NOT store token here.
export const adminRegister = createAsyncThunk(
  "auth/adminRegister",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerAdmin(data);

      // NO AUTO LOGIN: don't save token
      // return admin object for UI if needed
      return res.data.admin;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ADMIN LOGIN
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginAdmin(data);

      saveToken(res.data.token);

      // must match backend: res.data.admin
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      return res.data.admin;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// USER UPDATE (protected)
export const userUpdate = createAsyncThunk(
  "auth/userUpdate",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateUser(data);

      // Your backend updateUser returns the updated user object directly (not wrapped)
      // res.data === updated user
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ================= SLICE =================

const initialState = {
  user: null,
  admin: JSON.parse(localStorage.getItem("admin")) || null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.admin = null;
      state.loading = false;
      state.error = null;
      clearAuth();
    },
    // Optional: if you want to manually set user/admin from elsewhere
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
      if (action.payload) {
        localStorage.setItem("admin", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("admin");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // USER REGISTER
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // payload is user object
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // USER LOGIN
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // payload is user object
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN REGISTER
      .addCase(adminRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.loading = false;
        // If you want to show who was created (but not logged in):
        // state.admin = action.payload;
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN LOGIN
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload; // payload is admin object
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // USER UPDATE
      .addCase(userUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // payload is updated user
      })
      .addCase(userUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUser, setAdmin } = userSlice.actions;
export default userSlice.reducer;