import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Loading from 'components/contextual/Loading';
import PodcastScreen from 'screens/podcastScreen/PodcastScreen';
import { useLazyGetPodcastsQuery } from 'redux/services/podcastServiceApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PodcastDetailScreen from 'screens/podcastDetailScreen.tsx/PodcasDetailScreen';

export default function App() {

  /**
   * Persistencia
   * Estilo de reproductor
   * / */

  const [getPodcasts] = useLazyGetPodcastsQuery();
  const dispatch = useDispatch();

  useEffect(()=>{
    const fetchData = async () => {
      await getPodcasts(null)
    }
    fetchData()
  },[getPodcasts])

  return (
    <>
      <Loading />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PodcastScreen />}/>
          <Route path='/podcast/:id' element={<PodcastDetailScreen />}/>
          <Route path='/podcast/:id/episode/:idEpisode' element={<PodcastDetailScreen />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}