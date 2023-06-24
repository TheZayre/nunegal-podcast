import Divider from 'components/divider/Divider';
import './podcastdetailscreen.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { podcastInformationPodcastSelected, resetSelected } from 'redux/slices/podcastSlice';
import { useEffect } from 'react';
import PodcastCard from './podcastCard/PodcastCard';
import PodcastEpisodes from './podcastEpisodes/PodcastEpisodes';
import PodcastEpisodeDetail from './podcastEpisodeDetail/PodcastEpisodeDetail';
import DBPresenter from 'redux/DBPresenter';

export default function PodcastDetailScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { id, idEpisode } = useParams();
  const { getPodcastPersistence } = DBPresenter()
  const podcastSelected = useSelector(podcastInformationPodcastSelected)
  console.log(podcastSelected)
  useEffect(() => {
    //Obtiene el detalle del podcast seleccionado
    getPodcastPersistence(id)
    return () => {
      dispatch(resetSelected())
    };
  }, [])


  return (
    <div className={'podcast-detail-screen-content'}>
      <h2 className={'title'} onClick={() => navigate('/')}>Podcaster</h2>
      <Divider className={'divider'} />
      {podcastSelected && Object.keys(podcastSelected)?.length
        ? <div className={'podcast-detail'}>
          <PodcastCard />
          {/*Dependiendo de si se encuentra el id de episodio en la url se cargará el 
          listado de episodios del podcast o el episodio seleccionado*/
            !idEpisode
              ? <PodcastEpisodes />
              : <PodcastEpisodeDetail />
          }
        </div>
        : <div className={'not-found'}>{'No se han encontrado resultados...'}</div>}
    </div>
  );
}