import './podcastepisodes.scss'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { podcastInformationPodcastEpisodes, podcastInformationPodcastSelected } from 'redux/slices/podcastSlice';

export default function PodcastEpisodes() {

  const podcastEpisodes = useSelector(podcastInformationPodcastEpisodes)
  const podcastSelected = useSelector(podcastInformationPodcastSelected)
  const navigate = useNavigate();

  const renderEpisodes = () => {
    let res = [] as any;
    let i = 0;
    
    for(let element in podcastEpisodes){
      let date = new Date(podcastEpisodes[element]?.isoDate) as any
      date = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()

      console.log(podcastEpisodes[element]?.guid);
      console.log(podcastEpisodes[element]?.guid.split('/').join());
      
      res.push(
        <div className={'header'} key={element}>
          <div className={i%2==0 ? 'title-element pair' : 'title-element'} onClick={()=>{navigate(`/podcast/${podcastSelected?.collectionId}/episode/${podcastEpisodes[element]?.guid.split('/').join()}`);}}>
            {podcastEpisodes[element]?.title}
            </div>
          <div className={i%2==0 ? 'date-element pair' : 'date-element'}>{date}</div>
          <div className={i%2==0 ? 'duration-element pair' : 'duration-element'}>{podcastEpisodes[element]?.itunes?.duration ?? '-'}</div>
      </div>
      )
      i++
    }
    return res;
  }
  
  return (
    <div className={'podcast-episodes-content'}>
      <div className={'total-episodes'}>{`Episodes: ${podcastEpisodes?.length}`}</div>

      <div className={'episodes-list'}>

      <div className={'header'}>
        <div className={'title'}>{'Title'}</div>
        <div className={'date'}>{'Date'}</div>
        <div className={'duration'}>{'Duration'}</div>
      </div>
      {renderEpisodes()}

      </div>
    </div>
  );
}