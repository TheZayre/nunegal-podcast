import Divider from 'components/divider/Divider';
import './podcastdetailscreen.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setDescription, setEpisodes, setPodcast } from 'redux/slices/podcastSlice';
import { useLazyGetPodcastQuery } from 'redux/services/podcastServiceApi';
import { useEffect } from 'react';
import PodcastCard from './podcastCard/PodcastCard';
import Parser from 'rss-parser';
import PodcastEpisodes from './podcastEpisodes/PodcastEpisodes';
import PodcastEpisodeDetail from './podcastEpisodeDetail/PodcastEpisodeDetail';

export default function PodcastDetailScreen() {
  const navigate = useNavigate();
  let parser = new Parser();
  const dispatch = useDispatch()
  const [getPodcast] = useLazyGetPodcastQuery()
  const { id, idEpisode } = useParams();
  console.log(idEpisode)

  useEffect(()=>{
    dispatch(setPodcast(null))
    const fetchData = () => {
      getPodcast(id).then(async (data)=>{
        dispatch(setPodcast(JSON.parse(data?.data?.contents)?.results[0]))

        let feed = await parser.parseURL(`${JSON.parse(data?.data?.contents)?.results[0]?.feedUrl}`);
        dispatch(setEpisodes(feed?.items))
        dispatch(setDescription(feed?.description))
    })
  }
    fetchData()
  },[])
  

  return (
    <div className={'podcast-detail-screen-content'}>
        <h2 className={'title'} onClick={()=>navigate('/')}>Podcaster</h2>
        <Divider className={'divider'}/>
        <div className={'podcast-detail'}>
          <PodcastCard/>
          {!idEpisode
            ?<PodcastEpisodes/>
            :<PodcastEpisodeDetail/>
          }
        </div>
    </div>
  );
}