import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getPublications,
  getPublication,
  createPublication,
  updatePublication,
  deletePublication,
} from "../../api"

// --------------------
// ASYNC THUNKS
// --------------------

// Fetch all publications
export const fetchPublications = createAsyncThunk(
  "publications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getPublications()
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// Fetch single publication
export const fetchPublication = createAsyncThunk(
  "publications/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getPublication(id)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// Create publication (PDF upload)
export const addPublication = createAsyncThunk(
  "publications/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createPublication(formData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// Update publication (replace PDF or metadata)
export const editPublication = createAsyncThunk(
  "publications/edit",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await updatePublication(id, formData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// Delete publication
export const removePublication = createAsyncThunk(
  "publications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deletePublication(id)
      return { id }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// --------------------
// SLICE
// --------------------

const publicationSlice = createSlice({
  name: "publications",
  initialState: {
    publications: [],
    publication: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPublication: (state) => {
      state.publication = null
    },
    clearPublicationError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchPublications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPublications.fulfilled, (state, action) => {
        state.loading = false
        state.publications = action.payload
      })
      .addCase(fetchPublications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // FETCH ONE
      .addCase(fetchPublication.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPublication.fulfilled, (state, action) => {
        state.loading = false
        state.publication = action.payload
      })
      .addCase(fetchPublication.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ADD
      .addCase(addPublication.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addPublication.fulfilled, (state, action) => {
        state.loading = false
        state.publications.unshift(action.payload)
      })
      .addCase(addPublication.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // EDIT
      .addCase(editPublication.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(editPublication.fulfilled, (state, action) => {
        state.loading = false
        state.publications = state.publications.map((p) =>
          p._id === action.payload._id ? action.payload : p
        )
      })
      .addCase(editPublication.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // DELETE
      .addCase(removePublication.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removePublication.fulfilled, (state, action) => {
        state.loading = false
        state.publications = state.publications.filter(
          (p) => p._id !== action.payload.id
        )
      })
      .addCase(removePublication.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearPublication, clearPublicationError } =
  publicationSlice.actions

export default publicationSlice.reducer
