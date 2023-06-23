import Divider from 'components/divider/Divider';
import './podcastcard.scss'
import { useSelector } from 'react-redux';
import { podcastInformationPodcastSelected } from 'redux/slices/podcastSlice';

export default function PodcastCard() {

  const podcastSelected = useSelector(podcastInformationPodcastSelected)
  
  return (
    <div className={'podcast-card-content'}>
        <img className={'image'} src={podcastSelected?.artworkUrl600}/>
        <Divider/>
        <div className={'title'}>{podcastSelected?.collectionName}</div>
        <div className={'author'}>{podcastSelected?.artistName ? `by ${podcastSelected?.artistName}` : ''}</div>
        <Divider/>
        <div className={'title'}>{'Description:'}</div>
        <div className={'description'} dangerouslySetInnerHTML={{__html:podcastSelected?.description}}/>
    </div>
  );
}