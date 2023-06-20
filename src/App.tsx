import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ContextualMessage from 'components/contextual/ContextualMessage';
import './App.css';
import Loading from 'components/contextual/Loading';
import PodcastScreen from 'screens/podcastScreen/PodcastScreen';
import { useLazyGetPodcastsQuery } from 'redux/services/podcastServiceApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPodcasts } from 'redux/slices/podcastSlice';
import PodcastDetailScreen from 'screens/podcastDetailScreen.tsx/PodcasDetailScreen';

export default function App() {

  const [getPodcasts] = useLazyGetPodcastsQuery();
  const dispatch = useDispatch();

  useEffect(()=>{
    const fetchData = async () => {
      await getPodcasts(null).then((data)=>dispatch(setPodcasts(data?.data)))
    }
    fetchData()
  },[getPodcasts])

  return (
    <>
      <ContextualMessage />
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