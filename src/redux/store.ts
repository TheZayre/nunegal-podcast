import { configureStore } from '@reduxjs/toolkit';
import { podcastSlice } from './slices/podcastSlice';
import { contextualSlice } from './slices/contextualSlice';
import { podcastServiceApi } from './services/podcastServiceApi';

export const reducer = {
  [podcastSlice.name]: podcastSlice.reducer,
  [contextualSlice.name]: contextualSlice.reducer,

  [podcastServiceApi.reducerPath]: podcastServiceApi.reducer,
}


export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 80,
      },
    }).concat(
      podcastServiceApi.middleware
    );
  },
  // devTools: process.env.NODE_ENV !== 'production',
  // enhancers: [batchedSubscribe(debounceNotify)],
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;