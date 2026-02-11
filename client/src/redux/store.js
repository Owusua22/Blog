import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./slice/userSlice"
import articleReducer from "./slice/articleSlice"
import commentReducer from "./slice/commentSlice"
import bannerReducer from "./slice/bannerSlice"
import publicationReducer from "./slice/publicationSlice"
import biographyReducer from "./slice/biographySlice" // ✅ ADD THIS

export const store = configureStore({
  reducer: {
    user: userReducer,
    articles: articleReducer,
    comments: commentReducer,
    banners: bannerReducer,
    publications: publicationReducer, // ✅ ADD THIS
      biography: biographyReducer,
  }
})
