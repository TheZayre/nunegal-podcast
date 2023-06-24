import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.scss';
import Loading from 'components/contextual/Loading';
import PodcastScreen from 'screens/podcastScreen/PodcastScreen';
import { useEffect } from 'react';
import PodcastDetailScreen from 'screens/podcastDetailScreen.tsx/PodcasDetailScreen';
import DBPresenter from 'redux/DBPresenter';

export default function App() {

  const { getPodcastsPersistence } = DBPresenter()

  useEffect(() => {
    //Obtiene el listado de podcasts
    getPodcastsPersistence()
  }, [])

  return (
    <>
      <Loading />
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<PodcastScreen />} />
          <Route path='/podcast/:id' element={<PodcastDetailScreen />} />
          <Route path='/podcast/:id/episode/:idEpisode' element={<PodcastDetailScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}