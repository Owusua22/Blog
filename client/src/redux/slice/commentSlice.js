import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { addComment, getCommentsByArticle, getComment, updateComment, deleteComment } from "../../api"

export const fetchComments = createAsyncThunk("comments/fetchByArticle", async (articleId, { rejectWithValue }) => {
  try { const res = await getCommentsByArticle(articleId); return { articleId, comments: res.data } } catch (err) { return rejectWithValue(err.response.data) }
})

export const createComment = createAsyncThunk("comments/add", async ({ articleId, data }, { rejectWithValue }) => {
  try { const res = await addComment(articleId, data); return res.data } catch (err) { return rejectWithValue(err.response.data) }
})

export const editComment = createAsyncThunk("comments/edit", async ({ commentId, data }, { rejectWithValue }) => {
  try { const res = await updateComment(commentId, data); return res.data } catch (err) { return rejectWithValue(err.response.data) }
})

export const removeComment = createAsyncThunk("comments/delete", async (commentId, { rejectWithValue }) => {
  try { await deleteComment(commentId); return { commentId } } catch (err) { return rejectWithValue(err.response.data) }
})

const commentSlice = createSlice({
  name: "comments",
  initialState: { commentsByArticle: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => { state.loading = true })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        state.commentsByArticle[action.payload.articleId] = action.payload.comments
      })
      .addCase(fetchComments.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createComment.fulfilled, (state, action) => {
        const articleId = action.payload.article
        if (!state.commentsByArticle[articleId]) state.commentsByArticle[articleId] = []
        state.commentsByArticle[articleId].push(action.payload)
      })

      .addCase(editComment.fulfilled, (state, action) => {
        const articleId = action.payload.article
        state.commentsByArticle[articleId] = state.commentsByArticle[articleId].map(c => c._id === action.payload._id ? action.payload : c)
      })

      .addCase(removeComment.fulfilled, (state, action) => {
        for (let key in state.commentsByArticle) {
          state.commentsByArticle[key] = state.commentsByArticle[key].filter(c => c._id !== action.payload.commentId)
        }
      })
  }
})

export default commentSlice.reducer
