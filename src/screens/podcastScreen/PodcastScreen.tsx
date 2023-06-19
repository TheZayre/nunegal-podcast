import Divider from 'components/divider/Divider';
import './podcastscreen.scss'
import PodcastElement from './podcastElement/podcastElement';
export default function PodcastScreen() {

  const renderPodcasts = () =>  {
      let res = [] as any
      for(let i=0; i<100; i++)
      {
        res.push(<PodcastElement/>)
      }
      return <div className={'podcast-list'}>{res}</div>;
  }


  return (
    <div className={'podcast-screen-content'}>
        <h2 className={'title'}>Podcaster</h2>
        <Divider/>
        <div className={'filter'}>
          <div className={'total-podcasts'}>{100}</div>
          <input className={'input-filter'} placeholder={'Filter podcasts...'}/>
        </div>
        {renderPodcasts()}
    </div>
  );
}