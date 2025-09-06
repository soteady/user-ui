import { configureStore } from '@reduxjs/toolkit';
import masterSlice from './slices/masterSlice';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    master: masterSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;