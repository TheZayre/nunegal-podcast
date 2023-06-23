import Parser from "rss-parser";
import { moreOldThanADay } from "utils/DateUtils";
import { contextualSlice } from "./slices/contextualSlice";
import { setEpisodes, setDescription, setPodcast } from "./slices/podcastSlice";
import { useDispatch } from "react-redux";
import { useLazyGetPodcastQuery } from "./services/podcastServiceApi";

const CORS_PROXY_2 = "https://cors-anywhere.herokuapp.com/";

export default function DBPresenter(){
    const dispatch = useDispatch()
    const [getPodcast] = useLazyGetPodcastQuery()

    async function getPodcastPersistance(id:any){
        let feed: { [key: string]: any; } & Parser.Output<{ [key: string]: any; }>;

        const request = indexedDB.open("podcast", 2)
        request.onerror = function(event) {
        // Manejar errores
        console.log(event)
        };
        request.onupgradeneeded = function(event:any) {
        var db = event?.target?.result;
        if (!db.objectStoreNames.contains('podcastElement')) {
            db.createObjectStore('podcastElement', { keyPath: 'id' });
        }
        };
        request.onsuccess = async function(event:any) {
        var db = event?.target?.result;
        var transaction = db.transaction(['podcastElement'], 'readwrite');
        var store = transaction.objectStore('podcastElement');
        
        let requestGet  = store.get(id);
        requestGet.onsuccess = async function(event:any) {
            var result = event?.target?.result;
            if(result?.timeAdded && !moreOldThanADay(result?.timeAdded)){
                feed = result?.data;
                dispatch(setPodcast((JSON.parse(feed?.contents)?.results[0])))
                dispatch(contextualSlice.actions.updateShowLoading(false))
            }
            else{
                getPodcast(id).then((data)=>{
                    feed = data?.data
                    const request = indexedDB.open("podcast", 2)
                    request.onerror = function(event) {
                        // Manejar errores
                        console.log(event)
                    };
                    request.onupgradeneeded = function(event:any) {
                        var db = event?.target?.result;
                        if (!db.objectStoreNames.contains('podcastElement')) {
                        db.createObjectStore('podcastElement', { keyPath: 'id' });
                        }
                    };
                    request.onsuccess = async function(event:any) {
                        var db = event?.target?.result;
                        var transaction = db.transaction(['podcastElement'], 'readwrite');
                        var store = transaction.objectStore('podcastElement');
                        store.delete(id);
                        store.add({id:id, data: feed, timeAdded: new Date()});
                        getEpisodesPersistance(data?.data)
                    }
                    dispatch(setPodcast((JSON.parse(feed?.contents)?.results[0])))
                    dispatch(contextualSlice.actions.updateShowLoading(false))
                })
                
            }
            
            
            
            };
        }
        
    }


    async function getEpisodesPersistance(data:any){
        console.log(data);
        
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
        }
        
    }

    return {
        getPodcastPersistance
      };

}