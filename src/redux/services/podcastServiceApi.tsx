import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const podcastServiceApi = createApi({
  reducerPath: '`podcastServiceApi`',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_ENDPOINT
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
          const { data } = await queryFulfilled;
          console.log('success!', data);
        } catch (err) {
          console.log('error... ', err);
        } finally {
        }
      }
    
    }),

    
    getPodcast: builder.query<any, any>({
        query: (podcastId) => ({
          url: `https://itunes.apple.com/lookup?id=${podcastId}`,
          method: 'GET',
        }),
  
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          console.log('starting!');
          try {
            const { data } = await queryFulfilled;
            console.log('success!', data);
          } catch (err) {
            console.log('error... ', err);
          } finally {
          }
        }
      
      }),

  })
});
export const {
    useGetPodcastQuery, useGetPodcastsQuery
} = podcastServiceApi;