import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { contextualSlice } from 'redux/slices/contextualSlice';
import { setDescription, setEpisodes, setPodcast, setPodcasts } from 'redux/slices/podcastSlice';
import Parser from 'rss-parser';
import { moreOldThanADay } from 'utils/DateUtils';

const CORS_PROXY = "https://api.allorigins.win/get?url=";
const CORS_PROXY_2 = "https://cors-anywhere.herokuapp.com/";

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
          dispatch(setPodcasts(data))
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
            
            dispatch(setPodcast(JSON.parse(data?.contents)?.results[0]))
            let parser = new Parser();
            let feed: { [key: string]: any; } & Parser.Output<{ [key: string]: any; }>;

            const request = indexedDB.open("podcast", 1)
            request.onerror = function(event) {
              // Manejar errores
              console.log(event)
            };
            request.onupgradeneeded = function(event:any) {
              var db = event?.target?.result;
              if (!db.objectStoreNames.contains('episodes')) {
                db.createObjectStore('episodes', { keyPath: 'id' });
              }
            };
            request.onsuccess = async function(event:any) {
              var db = event?.target?.result;
              var transaction = db.transaction(['episodes'], 'readwrite');
              var store = transaction.objectStore('episodes');
              
              let requestGet  = store.get(JSON.parse(data?.contents)?.results[0]?.feedUrl);
              requestGet.onsuccess = async function(event:any) {
                var result = event?.target?.result;
                if(result?.timeAdded && !moreOldThanADay(result?.timeAdded)){
                  feed = result?.data;
                }
                else{
                  feed = await parser.parseURL(`${CORS_PROXY_2+JSON.parse(data?.contents)?.results[0]?.feedUrl}`)
                  const request = indexedDB.open("podcast", 1)
                  request.onerror = function(event) {
                    // Manejar errores
                    console.log(event)
                  };
                  request.onupgradeneeded = function(event:any) {
                    var db = event?.target?.result;
                    if (!db.objectStoreNames.contains('episodes')) {
                      db.createObjectStore('episodes', { keyPath: 'id' });
                    }
                  };
                  request.onsuccess = async function(event:any) {
                    var db = event?.target?.result;
                    var transaction = db.transaction(['episodes'], 'readwrite');
                    var store = transaction.objectStore('episodes');
                    store.delete(JSON.parse(data?.contents)?.results[0]?.feedUrl);
                    store.add({id:JSON.parse(data?.contents)?.results[0]?.feedUrl, data: feed, timeAdded: new Date()});
                  }
                }
                dispatch(setEpisodes(feed?.items))
                dispatch(setDescription(feed?.description))
                dispatch(contextualSlice.actions.updateShowLoading(false))
                
              }
            };
          
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