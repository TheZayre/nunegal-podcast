import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { contextualSlice } from 'redux/slices/contextualSlice';

const CORS_PROXY = "https://api.allorigins.win/get?url=";

export const podcastServiceApi = createApi({
  reducerPath: '`podcastServiceApi`',
  baseQuery: fetchBaseQuery({
    baseUrl: undefined
  }),
  endpoints: (builder) => ({
    getPodcasts: builder.query<any, any>({
      query: () => ({
        url: 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json',
        method: 'GET',
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        console.log('starting!');
        try {
          dispatch(contextualSlice.actions.updateShowLoading(true))
          const { data } = await queryFulfilled;
          dispatch(contextualSlice.actions.updateShowLoading(false))
          console.log('success!', data);
        } catch (err) {
          dispatch(contextualSlice.actions.updateShowLoading(false))
          console.log('error... ', err);
        } finally {
        }
      }
    
    }),

    
    getPodcast: builder.query<any, any>({
        query: (podcastId) => ({
          url: `${CORS_PROXY}https://itunes.apple.com/lookup?id=${podcastId}`,
          method: 'GET',
        }),
  
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          console.log('starting!');
          try {
            dispatch(contextualSlice.actions.updateShowLoading(true))
            const { data } = await queryFulfilled;
            dispatch(contextualSlice.actions.updateShowLoading(false))
          } catch (err) {
            dispatch(contextualSlice.actions.updateShowLoading(false))
            console.log('error... ', err);
          } finally {
          }
        }
      
      }),
  })
});
export const {
  useLazyGetPodcastQuery, useLazyGetPodcastsQuery
} = podcastServiceApi;