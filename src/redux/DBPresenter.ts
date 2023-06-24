import Parser from "rss-parser";
import { moreOldThanADay } from "utils/DateUtils";
import { contextualSlice } from "./slices/contextualSlice";
import { setEpisodes, setDescription, setPodcast, setPodcasts } from "./slices/podcastSlice";
import { useDispatch } from "react-redux";
import { useLazyGetPodcastQuery, useLazyGetPodcastsQuery } from "./services/podcastServiceApi";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export default function DBPresenter() {
    const dispatch = useDispatch();
    const [getPodcast] = useLazyGetPodcastQuery();
    const [getPodcasts] = useLazyGetPodcastsQuery();

    async function getPodcastsPersistence() {
        let feed: { [key: string]: any } & Parser.Output<{ [key: string]: any }>;

        try {
            const db = await openDatabase("podcast", 3);
            const store = db.transaction(["podcastList"], "readwrite").objectStore("podcastList");
            const requestGet = store.get("podcastList");
            requestGet.onsuccess = async function (event: any) {
                const result = event.target.result;
                if (result?.timeAdded && !moreOldThanADay(result?.timeAdded)) {
                    feed = result?.data;
                    dispatch(setPodcasts(feed));
                    dispatch(contextualSlice.actions.updateShowLoading(false));
                } else {
                    const data = await getPodcasts(null);
                    feed = data?.data;
                    const db = await openDatabase("podcast", 3);
                    const transaction = db.transaction(["podcastList"], "readwrite");
                    const store = transaction.objectStore("podcastList");
                    const deleteRequest = store.delete("podcastList");
                    deleteRequest.onsuccess = function () {
                        const addRequest = store.add({ id: "podcastList", data: feed, timeAdded: new Date() });
                        addRequest.onsuccess = function () {
                            dispatch(setPodcast(feed));
                            dispatch(contextualSlice.actions.updateShowLoading(false));
                        };
                    };
                }
            };
        } catch (error) {
            console.log(error);
        }
    }

    async function getPodcastPersistence(id: any) {
        let feed: { [key: string]: any } & Parser.Output<{ [key: string]: any }>;

        try {
            const db = await openDatabase("podcast", 3);
            const store = db.transaction(["podcastElement"], "readwrite").objectStore("podcastElement");
            const requestGet = store.get(id);
            requestGet.onsuccess = async function (event: any) {
                const result = event.target.result;
                if (result?.timeAdded && !moreOldThanADay(result?.timeAdded)) {
                    feed = result?.data;
                    getEpisodesPersistence(result?.data);
                    dispatch(setPodcast(JSON.parse(feed?.contents)?.results[0]));
                    dispatch(contextualSlice.actions.updateShowLoading(false));
                } else {
                    const data = await getPodcast(id);
                    if (!JSON.parse(data?.data?.contents)?.errorMessage) {
                        feed = data?.data;
                        const db = await openDatabase("podcast", 3);
                        const transaction = db.transaction(["podcastElement"], "readwrite");
                        const store = transaction.objectStore("podcastElement");
                        const deleteRequest = store.delete(id);
                        deleteRequest.onsuccess = function () {
                            const addRequest = store.add({ id: id, data: feed, timeAdded: new Date() });
                            addRequest.onsuccess = function () {
                                getEpisodesPersistence(data?.data);
                                dispatch(setPodcast(JSON.parse(feed?.contents)?.results[0]));
                                dispatch(contextualSlice.actions.updateShowLoading(false));
                            };
                        };

                    }
                    else {
                        dispatch(setPodcast(null));
                        dispatch(contextualSlice.actions.updateShowLoading(false));
                    }
                }
            };
        } catch (error) {
            console.log(error);
        }
    }

    async function getEpisodesPersistence(data: any) {
        let parser = new Parser();
        let feed: any;

        try {
            const db = await openDatabase("podcast", 3);
            const store = db.transaction(["episodes"], "readwrite").objectStore("episodes");
            const requestGet = store.get(JSON.parse(data?.contents)?.results[0]?.feedUrl);
            requestGet.onsuccess = async function (event: any) {
                const result = event.target.result;
                if (result?.timeAdded && !moreOldThanADay(result?.timeAdded)) {
                    feed = result?.data;
                    dispatch(setEpisodes(feed?.items));
                    dispatch(setDescription(feed?.description));
                } else {
                    dispatch(contextualSlice.actions.updateShowLoading(true));
                    feed = await parser.parseURL(`${CORS_PROXY + JSON.parse(data?.contents)?.results[0]?.feedUrl}`).catch((e)=>{
                        console.log(e)
                    });
                    if(feed){
                    const db = await openDatabase("podcast", 3);
                    const transaction = db.transaction(["episodes"], "readwrite");
                    const store = transaction.objectStore("episodes");
                    const deleteRequest = store.delete(JSON.parse(data?.contents)?.results[0]?.feedUrl);
                    deleteRequest.onsuccess = function () {
                        const addRequest = store.add({ id: JSON.parse(data?.contents)?.results[0]?.feedUrl, data: feed, timeAdded: new Date() });
                        addRequest.onsuccess = function () {
                            dispatch(setEpisodes(feed?.items));
                            dispatch(setDescription(feed?.description));
                            dispatch(contextualSlice.actions.updateShowLoading(false));
                        };
                    };
                }
                dispatch(setEpisodes(feed?.items));
                dispatch(setDescription(feed?.description));
                dispatch(contextualSlice.actions.updateShowLoading(false));
            };
        }
        } catch (error) {
            console.log(error);
        }
    }

    async function openDatabase(name: string, version: number) {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(name, version);
            request.onerror = function (event) {
                reject(event);
            };
            request.onsuccess = function (event: any) {
                resolve(event.target.result);
            };
            request.onupgradeneeded = function (event: any) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("podcastList")) {
                    db.createObjectStore("podcastList", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("podcastElement")) {
                    db.createObjectStore("podcastElement", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("episodeList")) {
                    db.createObjectStore("episodeList", { keyPath: "id" });
                }
            };
        });
    }

    return {
        getPodcastsPersistence,
        getPodcastPersistence,
        getEpisodesPersistence,
    };
}
