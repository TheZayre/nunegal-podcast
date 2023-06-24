import { useEffect, useState } from 'react';
import './podcastepisodedetail.scss'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { podcastInformationPodcastEpisodes } from 'redux/slices/podcastSlice';

export default function PodcastEpisodeDetail() {

  const podcastEpisodes = useSelector(podcastInformationPodcastEpisodes)
  const [episodeSelected, setEpisodeSelected] = useState() as any
  const { idEpisode } = useParams();

  useEffect(()=>{
    //Busca el episodio seleccionado
    let filter = podcastEpisodes.find(({guid})=>guid.split('/').join().includes(idEpisode))
    setEpisodeSelected(filter)
    
  },[podcastEpisodes])
  
  return (
    <div className={'podcast-episode-detail-content'}>
      <div className={'title'}>{episodeSelected?.title}</div>
      {episodeSelected
        ?<div className={'description'} dangerouslySetInnerHTML={{__html:episodeSelected["content:encoded"] ?? episodeSelected?.content}}/>
        :null
      }
      <audio className={'audio'} controls src={episodeSelected?.enclosure?.url}></audio>
    </div>
  );
}