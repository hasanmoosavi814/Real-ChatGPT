import { configureStore } from "@reduxjs/toolkit";
import { aiHealthApi } from "@services/health.api";
import { api } from "@services/api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [aiHealthApi.reducerPath]: aiHealthApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, aiHealthApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
