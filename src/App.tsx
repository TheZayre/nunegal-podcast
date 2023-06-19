import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ContextualMessage from 'components/contextual/ContextualMessage';
import './App.css';
import Loading from 'components/contextual/Loading';
import PodcastScreen from 'screens/podcastScreen/PodcastScreen';
import { useLazyGetPodcastsQuery } from 'redux/services/podcastServiceApi';
import { useEffect } from 'react';

export default function App() {

  const [getPodcasts] = useLazyGetPodcastsQuery()

  useEffect(()=>{
    const fetchData = async () => {
      await getPodcasts(null).then((data)=>console.log(data?.data))
    }
    fetchData()
  },[])

  return (
    <>
      <ContextualMessage />
      <Loading />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PodcastScreen />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}