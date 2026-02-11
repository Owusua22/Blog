import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBiography,
  createBiography,
  updateBiography,
  deleteBiography,
} from "../../api";

// Fetch all biographies
export const fetchBiographies = createAsyncThunk(
  "biography/fetchAll",
  async () => {
    const res = await getBiography(); // should return array of biographies
    return res.data || [];
  }
);

// Add new biography
export const addBiography = createAsyncThunk(
  "biography/add",
  async (data) => {
    const res = await createBiography(data);
    return res.data;
  }
);

// Edit biography
export const editBiography = createAsyncThunk(
  "biography/edit",
  async ({ id, data }) => {
    const res = await updateBiography(id, data);
    return res.data;
  }
);

// Delete biography
export const removeBiography = createAsyncThunk(
  "biography/remove",
  async (id) => {
    await deleteBiography(id);
    return id;
  }
);

const biographySlice = createSlice({
  name: "biography",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchBiographies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBiographies.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBiographies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addBiography.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Edit
      .addCase(editBiography.fulfilled, (state, action) => {
        state.items = state.items.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })

      // Delete
      .addCase(removeBiography.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      });
  },
});

export default biographySlice.reducer;
