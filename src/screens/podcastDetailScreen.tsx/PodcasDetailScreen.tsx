import Divider from 'components/divider/Divider';
import './podcastdetailscreen.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetSelected} from 'redux/slices/podcastSlice';
import { useLazyGetPodcastQuery } from 'redux/services/podcastServiceApi';
import { useEffect } from 'react';
import PodcastCard from './podcastCard/PodcastCard';
import PodcastEpisodes from './podcastEpisodes/PodcastEpisodes';
import PodcastEpisodeDetail from './podcastEpisodeDetail/PodcastEpisodeDetail';
import DBPresenter from 'redux/DBPresenter';

export default function PodcastDetailScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [getPodcast] = useLazyGetPodcastQuery()
  const { id, idEpisode } = useParams();
  const {getPodcastPersistance} = DBPresenter()

  useEffect(()=>{
    const fetchData = () => {
      getPodcastPersistance(id)
      //getPodcast(id)
  }
    fetchData()
    return () => {
       dispatch(resetSelected())
    };
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