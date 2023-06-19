import './podcastelement.scss'
export default function PodcastElement() {


  return (
    <div className={'podcast-element-content'}>
        <img className={'podcast-image'} src={'https://cdn.slidesharecdn.com/ss_thumbnails/arqwebhttp-1223462128093806-8-thumbnail.jpg?width=640&height=640&fit=bounds'}></img>
        <div className={'podcast-title'}>{'ALL SONGS CONSIDERED'}</div>
        <div className={'podcast-author'}>{'Author: NPR'}</div>
    </div>
  );
}