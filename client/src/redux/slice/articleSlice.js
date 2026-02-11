import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle
} from "../../api";

// ================================
// Async Thunks
// ================================
export const fetchArticles = createAsyncThunk(
  "articles/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getArticles();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchArticle = createAsyncThunk(
  "articles/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getArticle(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const addArticle = createAsyncThunk(
  "articles/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createArticle(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const editArticle = createAsyncThunk(
  "articles/edit",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await updateArticle(id, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const removeArticle = createAsyncThunk(
  "articles/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteArticle(id);
      return { id };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const toggleLikeArticle = createAsyncThunk(
  "articles/like",
  async (id, { rejectWithValue }) => {
    try {
      const res = await likeArticle(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ================================
// Slice
// ================================
const initialState = {
  articles: [],
  article: null,
  loading: false,
  error: null
};

const articleSlice = createSlice({
  name: "articles",
  initialState,
  
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchArticles.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchArticles.fulfilled, (state, action) => { state.loading = false; state.articles = action.payload; })
      .addCase(fetchArticles.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch one
      .addCase(fetchArticle.pending, (state) => { state.loading = true; state.error = null; })
 // articleSlice.js — Update the fetchArticle fulfilled case

.addCase(fetchArticle.fulfilled, (state, action) => {
  state.loading = false;
  // ✅ Extract article and comments from response
  state.article = action.payload.article;
  state.comments = action.payload.comments || [];
})
      .addCase(fetchArticle.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Add
      .addCase(addArticle.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addArticle.fulfilled, (state, action) => { state.loading = false; state.articles.push(action.payload); })
      .addCase(addArticle.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Edit
      .addCase(editArticle.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(editArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = state.articles.map(a => a._id === action.payload._id ? action.payload : a);
      })
      .addCase(editArticle.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Delete
      .addCase(removeArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter(a => a._id !== action.payload.id);
      })

      // Like
      .addCase(toggleLikeArticle.fulfilled, (state, action) => {
        state.articles = state.articles.map(a => a._id === action.payload._id ? action.payload : a);
      });
  }
});

export default articleSlice.reducer;
