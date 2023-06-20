import './podcastepisodedetail.scss'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { podcastInformationPodcastEpisodes, podcastInformationPodcastSelected } from 'redux/slices/podcastSlice';

export default function PodcastEpisodeDetail() {

  const podcastEpisodes = useSelector(podcastInformationPodcastEpisodes)
  const podcastSelected = useSelector(podcastInformationPodcastSelected)
  const navigate = useNavigate();

  
  return (
    <div className={'podcast-episode-detail-content'}>
      <div className={'title'}>{'Title'}</div>
    </div>
  );
}