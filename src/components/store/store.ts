import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./api/user/userSlice";
import { apiSlice } from "./rootApi/apiSlice";

export const store: any = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
export const selectUser = (state: RootState) => state.user;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
