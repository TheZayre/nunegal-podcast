import Divider from 'components/divider/Divider';
import './podcastscreen.scss'
import PodcastElement from './podcastElement/podcastElement';
import { useDispatch, useSelector } from 'react-redux';
import { podcastInformationPodcastList, setPodcast } from 'redux/slices/podcastSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PodcastScreen() {

  const podcastList = useSelector(podcastInformationPodcastList)
  const [filter, setFilter] = useState('')
  const [number, setNumber] = useState(podcastList?.feed?.entry?.length ?? 0)

  const navigate = useNavigate();

  const onClickPodcast = (id: string) =>  {
    navigate(`/podcast/${id}`)
  }

  const renderPodcasts = () =>  {
    let res = [] as any
    //Filtra los podcasts escritos en el input por nombre o autor
    let filtered = podcastList?.feed?.entry.filter((element: { [x: string]: { label: string; }; })=>element["im:name"].label.toLowerCase().includes(filter.toLowerCase()) || 
      element["im:artist"].label.toLowerCase().includes(filter.toLowerCase()))
    for(let element in filtered)
    {
      res.push(<PodcastElement key={element} id={filtered[element].id.attributes["im:id"]}
        onClick={()=>onClickPodcast(filtered[element].id.attributes["im:id"])}
        title={filtered[element]["im:name"].label} 
        author={filtered[element]["im:artist"].label} 
        image={filtered[element]["im:image"][2].label}/>)
    }
    if(number!==filtered?.length)
      setNumber(filtered?.length)
    return <div className={'podcast-list'}>{res}</div>;
  }


  return (
    <div className={'podcast-screen-content'}>
        <h2 className={'title'}>Podcaster</h2>
        <Divider/>
        <div className={'filter'}>
          <div className={'total-podcasts'}>{number}</div>
          <input className={'input-filter'} 
            placeholder={'Filter podcasts...'}
            value={filter}
            onChange={(value:any)=>{setFilter(value?.target?.value)}}/>
        </div>
        {renderPodcasts()}
    </div>
  );
}