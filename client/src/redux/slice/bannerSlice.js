import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getBanners, getBanner, createBanner, updateBanner, deleteBanner } from "../../api"

export const fetchBanners = createAsyncThunk("banners/fetchAll", async (_, { rejectWithValue }) => {
  try { const res = await getBanners(); return res.data } catch (err) { return rejectWithValue(err.response.data) }
})

export const addBanner = createAsyncThunk("banners/add", async (formData, { rejectWithValue }) => {
  try { const res = await createBanner(formData); return res.data } catch (err) { return rejectWithValue(err.response.data) }
})

export const editBanner = createAsyncThunk("banners/edit", async ({ id, formData }, { rejectWithValue }) => {
  try { const res = await updateBanner(id, formData); return res.data } catch (err) { return rejectWithValue(err.response.data) }
})

export const removeBanner = createAsyncThunk("banners/delete", async (id, { rejectWithValue }) => {
  try { await deleteBanner(id); return { id } } catch (err) { return rejectWithValue(err.response.data) }
})

const bannerSlice = createSlice({
  name: "banners",
  initialState: { banners: [], banner: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => { state.loading = true })
      .addCase(fetchBanners.fulfilled, (state, action) => { state.loading = false; state.banners = action.payload })
      .addCase(fetchBanners.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(addBanner.fulfilled, (state, action) => { state.banners.push(action.payload) })
      .addCase(editBanner.fulfilled, (state, action) => {
        state.banners = state.banners.map(b => b._id === action.payload._id ? action.payload : b)
      })
      .addCase(removeBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter(b => b._id !== action.payload.id)
      })
  }
})

export default bannerSlice.reducer
