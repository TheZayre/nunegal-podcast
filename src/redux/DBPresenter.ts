import Parser from "rss-parser";
import { moreOldThanADay } from "utils/DateUtils";
import { contextualSlice } from "./slices/contextualSlice";
import { setEpisodes, setDescription, setPodcast, setPodcasts } from "./slices/podcastSlice";
import { useDispatch } from "react-redux";
import { useLazyGetPodcastQuery, useLazyGetPodcastsQuery } from "./services/podcastServiceApi";

// Constante para utilizar un proxy CORS
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export default function DBPresenter() {
    const dispatch = useDispatch();

    const [getPodcast] = useLazyGetPodcastQuery();
    const [getPodcasts] = useLazyGetPodcastsQuery();

    async function getPodcastsPersistence() {
        let feed: { [key: string]: any } & Parser.Output<{ [key: string]: any }>;

        try {
            // Abrir la base de datos "podcast"
            const db = await openDatabase("podcast", 1);

            // Obtener "podcastList" y realiza una solicitud pàra obtenerla
            const store = db.transaction(["podcastList"], "readwrite").objectStore("podcastList");
            const requestGet = store.get("podcastList");

            // Manejar el resultado de la solicitud de obtención
            requestGet.onsuccess = async function (event: any) {
                const result = event.target.result;

                // Comprobar si hay datos y si no son más antiguos de un día
                if (result?.timeAdded && !moreOldThanADay(result?.timeAdded)) {
                    // Si los datos son recientes, se obtienen del resultado de la solicitud
                    feed = result?.data;
                    dispatch(setPodcasts(feed));
                    dispatch(contextualSlice.actions.updateShowLoading(false));
                } else {
                    // Si los datos son antiguos, se obtienen mediante una consulta y se almacenan en el almacenamiento persistente
                    const data = await getPodcasts(null);
                    feed = data?.data;

                    // Actualizar el almacenamiento persistente con los nuevos datos
                    const db = await openDatabase("podcast", 1);
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
            // Abrir la base de datos "podcast"
            const db = await openDatabase("podcast", 1);

            // Obtener "podcastElement" y realiza una solicitud pàra obtenerla
            const store = db.transaction(["podcastElement"], "readwrite").objectStore("podcastElement");
            const requestGet = store.get(id);

            // Manejar el resultado de la solicitud de obtención
            requestGet.onsuccess = async function (event: any) {
                const result = event.target.result;

                // Comprobar si hay datos y si no son más antiguos de un día
                if (result?.timeAdded && !moreOldThanADay(result?.timeAdded)) {
                    // Si los datos son recientes, se obtienen del resultado de la solicitud
                    feed = result?.data;
                    getEpisodesPersistence(result?.data);
                    dispatch(setPodcast(JSON.parse(feed?.contents)?.results[0]));
                    dispatch(contextualSlice.actions.updateShowLoading(false));
                } else {
                    // Si los datos son antiguos, se obtienen mediante una consulta y se almacenan en el almacenamiento persistente
                    const data = await getPodcast(id);

                    // Comprobar si se obtuvieron datos válidos
                    if (!JSON.parse(data?.data?.contents)?.errorMessage) {
                        feed = data?.data;

                        // Actualizar el almacenamiento persistente con los nuevos datos
                        const db = await openDatabase("podcast", 1);
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
                    } else {
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
            // Abrir la base de datos "podcast"
            const db = await openDatabase("podcast", 1);

            // Obtener la tienda de objetos "episodes" y realizar una solicitud de obtención
            const store = db.transaction(["episodes"], "readwrite").objectStore("episodes");
            const requestGet = store.get(JSON.parse(data?.contents)?.results[0]?.feedUrl);

            // Manejar el resultado de la solicitud de obtención
            requestGet.onsuccess = async function (event: any) {
                const result = event.target.result;

                // Comprobar si hay datos y si no son más antiguos de un día
                if (result?.timeAdded && !moreOldThanADay(result?.timeAdded)) {
                    // Si los datos son recientes, se obtienen del resultado de la solicitud
                    feed = result?.data;
                    dispatch(setEpisodes(feed?.items));
                    dispatch(setDescription(feed?.description));
                } else {
                    // Si los datos son antiguos, se obtienen mediante una consulta y se almacenan en el almacenamiento persistente
                    dispatch(contextualSlice.actions.updateShowLoading(true));
                    feed = await parser.parseURL(`${CORS_PROXY + JSON.parse(data?.contents)?.results[0]?.feedUrl}`).catch((e) => {
                        console.log(e)
                    });

                    // Comprobar si se obtuvieron datos válidos
                    if (feed) {
                        // Actualizar el almacenamiento persistente con los nuevos datos
                        const db = await openDatabase("podcast", 1);
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
                }
            };
        } catch (error) {
            console.log(error);
        }
    }

    async function openDatabase(name: string, version: number) {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(name, version);

            // Eventos de apertura, error y actualización de la base de datos
            request.onerror = function (event) {
                reject(event);
            };
            request.onsuccess = function (event: any) {
                resolve(event.target.result);
            };
            request.onupgradeneeded = function (event: any) {
                const db = event.target.result;

                // Crea los objetos necesarios en caso de que no existan
                if (!db.objectStoreNames.contains("podcastList")) {
                    db.createObjectStore("podcastList", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("podcastElement")) {
                    db.createObjectStore("podcastElement", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("episodes")) {
                    db.createObjectStore("episodes", { keyPath: "id" });
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
