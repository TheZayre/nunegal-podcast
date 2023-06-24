import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Loading from 'components/contextual/Loading';
import PodcastScreen from 'screens/podcastScreen/PodcastScreen';
import { useLazyGetPodcastsQuery } from 'redux/services/podcastServiceApi';
import { useEffect } from 'react';
import PodcastDetailScreen from 'screens/podcastDetailScreen.tsx/PodcasDetailScreen';
import DBPresenter from 'redux/DBPresenter';

export default function App() {

  const {getPodcastsPersistance} = DBPresenter()
  const [getPodcasts] = useLazyGetPodcastsQuery();

  useEffect(()=>{
    const fetchData = async () => {
      getPodcastsPersistance()
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